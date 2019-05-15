import moment from 'moment'
import _ from 'lodash'
import { getAmount, getPrice } from '../order'
import BigNumber from 'bignumber.js'
import db from '../../models'
import { ORDER_SIDE } from '../../constants/order'

const {
  order: Order,
  market: Market,
  matchedOrder: MatchedOrder,
  transaction: Transaction,
  sequelize: { Op, literal },
} = db

const pricePrecision = 9

const sortMatchedOrders = (transactions) => {
  if (!Array.isArray(transactions)) transactions = [transactions]

  for (const transaction of transactions) {
    if (transaction.order.side === ORDER_SIDE.BUY) transaction.matchedOrders = _.reverse(transaction.matchedOrders)
  }

  return transactions
}
/**
 *
 * @param marketId - integer or null. iIf null, look for transactions for all markets
 * @param period - moment amount of unit to subtract
 * @param unit - moment unit can be 'days', 'hours', 'months'. If indicated 'hours' we take exactly period
 * from current moment minus amount of hours. For other units it takes start of day
 * @param userId - get only user transaction
 * @returns {{include: *[], attributes: string[], where: {createdAt: {}}, order: *[]}}
 */
const getTransactionOptions = (marketId, period, unit) => {
  let where = {}

  if (!_.isNil(marketId)) where.marketId = marketId

  let transactionWhere = {}

  if (!_.isNil(period) && !_.isNil(unit)) {
    transactionWhere.createdAt = unit === 'hours'
      ? { [Op.gte]: moment().subtract(period, unit).format() }
      : { [Op.gte]: moment().subtract(period, unit).startOf('day').format() }
  }

  return {
    attributes: ['id', 'createdAt'],
    order: [
      ['createdAt', 'DESC'],
      [literal('"matchedOrders"."quoteTokenAmount"/"matchedOrders"."baseTokenAmount"'), 'DESC'],
    ],
    where: transactionWhere,
    include: [
      {
        model: MatchedOrder,
        attributes: ['baseTokenAmount', 'quoteTokenAmount', 'matchedOrderId'],
        include: {
          model: Order,
          as: 'matchedOrder',
          attributes: ['side'],
          where,
          include: {
            model: Market,
            attributes: ['baseTokenDecimals', 'quoteTokenDecimals'],
          },
        },
      },
      {
        model: Order,
        attributes: ['side'],
      },
    ],
  }
}

const getLastMarketPrices = async () => {
  const options = getTransactionOptions(null, 24, 'hours')

  const markets = _.invokeMap(await Market.findAll({
    attributes: ['id', 'tokens', 'baseTokenDecimals', 'quoteTokenDecimals'],
    order: [[literal('"orders->transactions"."createdAt"'), 'DESC']],
    include: {
      model: Order,
      attributes: ['id'],
      include: {
        model: Transaction,
        ...options,
      },
    },
  }), 'get', { plain: true })

  return markets
}

const getLastFirstPrices = (transactions) => {
  const lastOrder = _.get(transactions, '[0].matchedOrders[0]')
  const firstOrder = _.get(_.last(transactions), 'matchedOrders[0]')

  const lastPrice = new BigNumber(getTransactionPriceByOrder(
    lastOrder.matchedOrder,
    lastOrder.quoteTokenAmount,
    lastOrder.baseTokenAmount))
  const firstPrice = new BigNumber(getTransactionPriceByOrder(
    firstOrder.matchedOrder,
    firstOrder.quoteTokenAmount,
    firstOrder.baseTokenAmount))

  return { lastPrice, firstPrice }
}

const getHighLowPrices = (transactions) => {
  let matchedOrders = _.flatten((transactions.map(t => t.matchedOrders)))

  const prices = matchedOrders.map(t => {
    return { price: getTransactionPriceByOrder(t.matchedOrder, t.quoteTokenAmount, t.baseTokenAmount) }
  })

  return { highPrice: (_.maxBy(prices, 'price')).price, lowPrice: (_.minBy(prices, 'price')).price }
}

const getChangeRate = (transactions, lastPrice, market) => {
  const firstOrder = _.get(_.last(transactions), 'matchedOrders[0]')

  const firstPrice = new BigNumber(getTransactionPriceByOrder(
    { market },
    firstOrder.quoteTokenAmount,
    firstOrder.baseTokenAmount))

  return ((lastPrice.minus(firstPrice)).dividedBy(firstPrice)).multipliedBy(100).toFixed(2)
}

/**
 *
 * @param transactions - object {
 *   matchedOrders: [{
 *     baseTokenAmount,
 *     ...
 *   },
 *   ....
 *   ]
 * }
 * @param market - object {
 *   baseTokenDecimals,
 *   ...
 * }
 */
const getMarketVolume = (transactions, market) => {
  if (!Array.isArray(transactions)) transactions = [transactions]

  const matchedOrders = _.flatten(_.map(transactions, 'matchedOrders', []))

  const baseTokenAmountSum = _.reduce(matchedOrders, (sum, m) => {
    return sum.plus(m.baseTokenAmount)
  }, new BigNumber('0'))

  return getAmount(market.baseTokenDecimals, baseTokenAmountSum)
}

const getTransactionPriceByOrder = (order, txQuoteTokenAmount, txBaseTokenAmount) => {
  return (getPrice(
    order.market.quoteTokenDecimals,
    order.market.baseTokenDecimals,
    txQuoteTokenAmount,
    txBaseTokenAmount,
  )).toFixed(pricePrecision)
}

/** *
 *
 * @param transactions = [
 * {
 *   matchedOrders:[
 *     {
 *       quoteTokenAmount,
 *       baseTokenAmount,
 *       ...
 *     }
 *   ]
 * }]
 * @param market - {
 *   baseTokenDecimals,
 *   ...
 * }
 * @returns {BigNumber}
 */
const getLastPrice = (transactions, market) => {
  const lastOrder = _.get(transactions, '[0].matchedOrders[0]')

  return new BigNumber(getTransactionPriceByOrder(
    { market },
    lastOrder.quoteTokenAmount,
    lastOrder.baseTokenAmount))
}

const getMakerTransactions = async (options, userId) => {
  let makerOptions = _.cloneDeep(options)
  makerOptions.include[1].where = { userId }

  return _.invokeMap(await Transaction.findAll(makerOptions), 'get', { plain: true })
}

const getTakerTransactions = async (options, userId) => {
  let takerOptions = _.cloneDeep(options)
  takerOptions.include[0].include.where.userId = userId

  return _.invokeMap(await Transaction.findAll(takerOptions), 'get', { plain: true })
}

const getDailyTransactions = (transactions) => {
  let dailyTransactions = {}

  for (const transaction of transactions) {
    const date = moment(transaction.createdAt).format('YYYY/MM/DD')
    if (!_.has(dailyTransactions, date)) dailyTransactions[date] = []

    dailyTransactions[date].push(transaction)
  }

  return dailyTransactions
}

const getDailyChartData = (dailyTransactions, market) => {
  let data = []
  const days = _.keys(dailyTransactions)

  for (const day of days) {
    const dayTransactions = dailyTransactions[day]
    const { lastPrice, firstPrice } = getLastFirstPrices(dayTransactions)
    const { highPrice, lowPrice } = getHighLowPrices(dayTransactions)
    const changeRate = ((lastPrice.minus(firstPrice)).dividedBy(firstPrice)).multipliedBy(100).toFixed(2)
    const priceChange = lastPrice.minus(firstPrice).toFixed(pricePrecision)
    const volume = getMarketVolume(dayTransactions, market)

    const dayData = []

    dayData.push(day)
    dayData.push(firstPrice.toFixed(pricePrecision))
    dayData.push(lastPrice.toFixed(pricePrecision))
    dayData.push(priceChange)
    dayData.push(changeRate)
    dayData.push(lowPrice)
    dayData.push(highPrice)
    dayData.push(volume)
    dayData.push('-')
    dayData.push('-')

    data.push(dayData)
  }

  return data
}

/**
 *
 * @param transactions - collection. [ {
 *   id,
 *   createdAt,
 *   order: {
 *     side,
 *     baseTokenAmount,
 *     quoteTokenAmount,
 *     initBaseTokenAmount,
 *     initQuoteTokenAmount
 *     market: {
 *       baseTokenDecimals,
 *       quoteTokenDecimals
 *     }
 *   },
 * }]
 *
 * @returns {Promise<void>}
 */
export const getTradeHistory = async (transactions) => {
  if (!Array.isArray(transactions)) transactions = [transactions]

  let tradeHistory = {}

  const sortedTransactions = sortMatchedOrders(transactions)

  for (const { id, createdAt, matchedOrders } of sortedTransactions) {
    const cleanDate = moment(createdAt).format('DD/MM/YYYY')

    for (const { baseTokenAmount, quoteTokenAmount, matchedOrder: order } of matchedOrders) {
      if (!_.has(tradeHistory, cleanDate)) tradeHistory[cleanDate] = []

      const amount = getAmount(order.market.baseTokenDecimals, baseTokenAmount)
      const price = getTransactionPriceByOrder(order, quoteTokenAmount, baseTokenAmount)

      const trade = {
        id,
        amount,
        price,
        side: order.side,
        createdAt: moment(createdAt).format(),
      }

      tradeHistory[cleanDate].push(trade)
    }
  }

  return tradeHistory
}

export const getTradeHistoryAllTransactions = async (marketId) => {
  const options = getTransactionOptions(marketId, 5, 'days')

  return _.invokeMap(await Transaction.findAll(options), 'get', { plain: true })
}

export const getTradeHistoryByTransactionId = async (id) => {
  const options = getTransactionOptions()
  const transaction = (await Transaction.findByPk(id, options)).get({ plain: true })

  if (_.isNil(transaction)) throw Error('Transaction for history with given Id not found')

  return getTradeHistory(transaction)
}

export const getTradeDashboardData = async (marketId) => {
  let data = {
    lastPrice: '0.00',
    firstPrice: '0.00',
    changeRate: '0.00',
    priceChange: '0.00',
    highPrice: '0.00',
    lowPrice: '0.00',
  }

  const options = getTransactionOptions(marketId, 24, 'hours')

  let transactions = _.invokeMap(await Transaction.findAll(options), 'get', { plain: true })
  if (_.isEmpty(transactions)) return data

  transactions = sortMatchedOrders(transactions)

  const { lastPrice, firstPrice } = getLastFirstPrices(transactions)

  data = { ...data, firstPrice: firstPrice.toFixed(pricePrecision), lastPrice: lastPrice.toFixed(pricePrecision) }

  data.changeRate = ((lastPrice.minus(firstPrice)).dividedBy(firstPrice)).multipliedBy(100).toFixed(2)
  data.priceChange = lastPrice.minus(firstPrice).toFixed(pricePrecision)

  data = { ...data, ...getHighLowPrices(transactions) }

  return data
}

export const getLandingDashboardData = async () => {
  const data = []
  const markets = await getLastMarketPrices()
  const initMarket = {
    lastPrice: '0.00',
    changeRate: '0.00',
  }

  for (const market of markets) {
    const { tokens, orders } = market
    const token = _.get((tokens.split('-')), '0')

    if (_.isEmpty(orders)) {
      data.push({ token, ...initMarket })
      continue
    }

    let transactions = _.flatten(_.map(orders, 'transactions'))

    if (_.isEmpty(transactions)) {
      data.push({ token, ...initMarket })
      continue
    }

    transactions = sortMatchedOrders(transactions)

    const lastPrice = getLastPrice(transactions, market)

    if (transactions.length === 1) {
      data.push({
        token,
        lastPrice: lastPrice.toFixed(pricePrecision),
        changeRate: '1.00',
      })
      continue
    }

    data.push({
      token,
      lastPrice: lastPrice.toFixed(pricePrecision),
      changeRate: getChangeRate(transactions, lastPrice, market),
    })
  }

  return data
}

export const getMarketsDashboardData = async () => {
  const data = []
  const markets = await getLastMarketPrices()
  const initMarket = {
    lastPrice: '0.00',
    amount: '0.00',
    changeRate: '0.00',
  }

  for (const market of markets) {
    const { tokens, orders } = market

    if (_.isEmpty(orders)) {
      data.push({ marketId: market.id, tokens, ...initMarket })
      continue
    }

    let transactions = _.flatten(_.map(orders, 'transactions', []))

    if (_.isEmpty(transactions)) {
      data.push({ marketId: market.id, tokens, ...initMarket })
      continue
    }

    transactions = sortMatchedOrders(transactions)
    const lastPrice = getLastPrice(transactions, market)
    const volume = getMarketVolume(transactions, market)

    if (transactions.length === 1) {
      data.push({
        marketId: market.id,
        tokens,
        lastPrice: lastPrice.toFixed(pricePrecision),
        amount: volume,
        changeRate: '1.00',
      })
      continue
    }

    data.push({
      marketId: market.id,
      tokens,
      lastPrice: lastPrice.toFixed(pricePrecision),
      amount: volume,
      changeRate: getChangeRate(transactions, lastPrice, market),
    })
  }

  return data
}

export const getChartData = async (market, period) => {
  const options = getTransactionOptions(market.id, period, 'days')

  let transactions = _.invokeMap(await Transaction.findAll(options), 'get', { plain: true })

  if (_.isEmpty(transactions)) return []

  transactions = sortMatchedOrders(transactions)

  const dailyTransactions = getDailyTransactions(transactions)

  return getDailyChartData(dailyTransactions, market)
}

export const getUserTradeHistory = async (marketId, userId) => {
  const options = getTransactionOptions(marketId, null, null)

  options.include[1].include = {
    model: Market,
    attributes: ['baseTokenDecimals', 'quoteTokenDecimals'],
  }

  options.include[1].attributes = [
    'side',
    'initBaseTokenAmount',
    'initQuoteTokenAmount',
    'baseTokenAmount',
    'quoteTokenAmount',
  ]

  let makerTransactions = await getMakerTransactions(options, userId)

  let takerTransactions = await getTakerTransactions(options, userId)

  let transactions = [...takerTransactions, ...makerTransactions]
  if (_.isEmpty(transactions)) return { marketId, data: {} }

  transactions = sortMatchedOrders(transactions)

  let tradeHistory = { marketId }
  tradeHistory.data = _.isEmpty(transactions) ? {} : await getTradeHistory(transactions)

  return tradeHistory
}
