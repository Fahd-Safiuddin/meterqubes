import _ from 'lodash'
import { getMinMaxGasTokenAmount, getOrderData, isValidSignature } from './sdk'
import db from '../../../models'
import BigNumber from 'bignumber.js'
import { getTradeOrderHash } from '../../../helpers/signature'
import { web3 } from '../../../lib/web3'

import { ORDER_SIDE, ORDER_STATUS } from '../../../constants/order'
import { sendTransaction } from '../../../helpers/web3transaction'
import createError from 'http-errors'
import moment from 'moment'
import { RELAYER } from '../../../config/web3'
import { getAmount, getPrice } from '../../../helpers/order'
import { emitToUser,
  emitNewTradeToHistory,
  emitNewOrderToHistory,
  emitDataChangedInOrdersByUser,
} from '../../../helpers/socket'
import { EVENT } from '../../../constants/socket'

const {
  order: Order,
  market: Market,
  user: User,
  matchedOrder: MatchedOrder,
  sequelize: { Op, cast, col, literal },
} = db
const { sequelize } = db
const ORDER_ATTRIBUTES = [
  'id',
  'side',
  'marketId',
  'baseTokenAmount',
  'quoteTokenAmount',
  'gasTokenAmount',
  'data',
  'signature',
  'signatureConfig',
  'signatureR',
  'signatureS',
  'previousStatus',
  'status',
  'userId',
]

const orderFullFilledData = {
  status: ORDER_STATUS.FULL_FILLED,
  baseTokenAmount: 0,
  quoteTokenAmount: 0,
}

const checkExpiresAtValid = async (orderExpiresAt) => {
  try {
    if (_.isNil(orderExpiresAt)) throw createError(400, 'Order expire required')

    const latestBlockTimestamp = await web3.eth.getBlock('latest')

    if (moment(orderExpiresAt).isSameOrBefore(latestBlockTimestamp.timestamp)) {
      throw createError(400, 'Order date cannot be earlier than current block time')
    }
  } catch (e) {
    throw createError(e.status || 500, `Check order Expires failed: ${e.message}`)
  }
}

const getMatchCondition = (orderSide, leftSide, rightSide) => {
  if (_.isNil(orderSide) ||
    _.isNil(leftSide) ||
    _.isNil(rightSide)
  ) {
    throw createError(500, 'Cannot get match conditions. Not all arguments provided')
  }

  const condition = orderSide === ORDER_SIDE.SELL ? '<=' : '>='

  return { quotes: sequelize.where(literal(leftSide), condition, literal(rightSide)) }
}

const getValidatedOrder = async (orderId, userId) => {
  if (
    _.isNil(orderId) ||
    _.isNil(userId)
  ) {
    throw createError(404, 'You need to provide user id and order id to get validated order')
  }

  const order = await Order.findOne(
    {
      attributes: ORDER_ATTRIBUTES,
      where: {
        id: orderId,
        status: { [Op.in]: [ORDER_STATUS.PENDING, ORDER_STATUS.PARTIALLY_FILLED] },
      },
      include: [{
        model: User,
        attributes: ['id', 'publicAddress'],
      }, {
        model: Market,
        attributes: ['id', 'baseTokenAddress', 'quoteTokenAddress'],
      },
      ],
    })

  if (_.isNil(order)) throw createError(404, 'Order by given Id not found')
  if (!_.isEqual(order.user.id, userId)) throw createError(404, 'Order by given Id not found for current user')

  return order
}

const getSumLimitedOrder = (side, marketId, userId, leftSide, rightSide) => {
  const condition = side === ORDER_SIDE.SELL ? '<=' : '>='

  return `
  ( SELECT SUM ( "baseTokenAmount" ) 
    FROM "order" 
    WHERE
      (
        "order"."isMarketOrder" = FALSE 
        AND ( "order"."expiresAt" > ${Math.floor(Date.now() / 1000)} OR "order"."expiresAt" IS NULL ) 
        AND CAST ( "order"."side" AS VARCHAR ) NOT LIKE '${side}' 
        AND "order"."marketId" = ${marketId} 
        AND ${leftSide} ${condition} ${rightSide} 
        AND "order"."userId" != ${userId}
        AND "order"."status" IN ('${ORDER_STATUS.PENDING}','${ORDER_STATUS.PARTIALLY_FILLED}')
      ) 
  )
  `
}

const getMatchedOrders = (baseTokenAmount, limitOrders) => {
  if (
    _.isNil(baseTokenAmount) ||
    _.isEmpty(limitOrders)
  ) {
    throw createError(404, 'You need to provide baseTokenAmount and limit order list')
  }

  let isSumTotallyMatched = true
  let isBaseTokenAmountFilled = true
  let baseTokenFilledAmounts = []
  const baseTokenAmountBig = new BigNumber(baseTokenAmount)
  let notMatchedBaseTokenAmount = 0

  if (baseTokenAmountBig.isEqualTo(limitOrders[0].sum)) {
    return {
      matchedOrderToProcess: limitOrders,
      isSumTotallyMatched,
      isBaseTokenAmountFilled,
      notMatchedBaseTokenAmount,
      baseTokenFilledAmounts: _.map(limitOrders, 'baseTokenAmount'),
    }
  }

  if (baseTokenAmountBig.isGreaterThan(limitOrders[0].sum)) {
    return {
      matchedOrderToProcess: limitOrders,
      isSumTotallyMatched,
      isBaseTokenAmountFilled: false,
      notMatchedBaseTokenAmount: baseTokenAmountBig.minus(limitOrders[0].sum),
      baseTokenFilledAmounts: _.map(limitOrders, 'baseTokenAmount'),
    }
  }

  let matchedOrderToProcess = []
  let totalMatch = new BigNumber('0')

  for (const limitOrder of limitOrders) {
    totalMatch = totalMatch.plus(new BigNumber(limitOrder.baseTokenAmount))
    matchedOrderToProcess.push(limitOrder)

    if (totalMatch.isLessThan(baseTokenAmountBig)) {
      baseTokenFilledAmounts.push(limitOrder.baseTokenAmount)
      continue
    }
    if (totalMatch.isGreaterThan(baseTokenAmountBig)) {
      isSumTotallyMatched = false
      notMatchedBaseTokenAmount = totalMatch.minus(baseTokenAmountBig)
      baseTokenFilledAmounts.push(new BigNumber(limitOrder.baseTokenAmount).minus(notMatchedBaseTokenAmount).toFixed(0))
      break
    }
    if (totalMatch.isEqualTo(new BigNumber(baseTokenAmount))) {
      baseTokenFilledAmounts.push(limitOrder.baseTokenAmount)
      break
    }
  }
  return {
    matchedOrderToProcess,
    isSumTotallyMatched,
    notMatchedBaseTokenAmount,
    baseTokenFilledAmounts,
    isBaseTokenAmountFilled,
  }
}

const getLimitOrders = async (order, userId) => {
  if (
    _.isEmpty(order) ||
    _.isNil(userId)
  ) {
    throw createError(404, 'You need to provide order and userId')
  }

  const { baseTokenAmount, quoteTokenAmount, side, marketId } = order

  const orderUnitPrice = new BigNumber(quoteTokenAmount).dividedBy(new BigNumber(baseTokenAmount))
  const leftSide = `${baseTokenAmount}*"baseTokenAmount"`
  const rightSide = `${quoteTokenAmount}*"quoteTokenAmount"`

  let matchCondition = getMatchCondition(side, leftSide, rightSide)

  let orderLimitOrders = side === ORDER_SIDE.SELL
    ? [[literal('"quoteTokenAmount"/"baseTokenAmount"'), 'DESC']]
    : [[literal('"quoteTokenAmount"/"baseTokenAmount"'), 'ASC']]

  return _.invokeMap(await Order.findAll({
    attributes: [
      ...ORDER_ATTRIBUTES,
      [literal('"quoteTokenAmount"/"baseTokenAmount"'), 'limitOrderPrice'],
      [literal(`${orderUnitPrice}`), 'newOrderPrice'],
      [literal(leftSide), 'LSide'],
      [literal(rightSide), 'RSide'],
      [literal(getSumLimitedOrder(side, marketId, userId, leftSide, rightSide)), 'sum'],
    ],
    where: {
      [Op.and]: [
        { isMarketOrder: false },
        {
          expiresAt: {
            [Op.or]:
              [
                { [Op.gt]: Math.floor(Date.now() / 1000) },
                null,
              ],
          },
        },
        sequelize.where(cast(col('order.side'), 'varchar'), { [Op.notLike]: order.side }),
        { marketId: order.marketId },
        matchCondition,
        { userId: { [Op.ne]: userId } },
        { status: { [Op.or]: [ORDER_STATUS.PENDING, ORDER_STATUS.PARTIALLY_FILLED] } },
      ],
    },
    include: {
      model: User,
      attributes: ['id', 'publicAddress'],
    },
    order: [
      ...orderLimitOrders,
      ['createdAt', 'ASC'],
    ],

  }), 'get', { plain: true })
}

const getPartiallyUpdateAttributes = (order, notMatchedAmount) => {
  const rate = new BigNumber(order.quoteTokenAmount).dividedBy(order.baseTokenAmount)
  const newQuoteTokenAmount = new BigNumber(notMatchedAmount).multipliedBy(rate)

  return {
    status: ORDER_STATUS.PARTIALLY_FILLED,
    baseTokenAmount: notMatchedAmount,
    quoteTokenAmount: newQuoteTokenAmount,
  }
}

const updateTakerOrder = async (takerOrder, isBaseTokenAmountFilled, notMatchedBaseTokenAmount, transaction) => {
  if (
    !_.isBoolean(isBaseTokenAmountFilled) ||
    _.isEmpty(takerOrder)
  ) {
    throw createError(500, 'Method updateTakerOrder has wrong arguments')
  }

  const { id, userId } = takerOrder

  if (isBaseTokenAmountFilled) {
    await Order.update(orderFullFilledData, { where: { id }, transaction })
    await emitToUser(EVENT.ORDER_CHANGED, { id, ...orderFullFilledData }, userId)
  } else {
    const orderPartiallyFilledData = getPartiallyUpdateAttributes(takerOrder, notMatchedBaseTokenAmount)
    await Order.update(orderPartiallyFilledData, { where: { id }, transaction })
    await emitToUser(EVENT.ORDER_CHANGED, { id, ...orderPartiallyFilledData }, userId)
  }
}

const createMatchedOrders = async (
  isSumTotallyMatched,
  makerOrders,
  notMatchedBaseTokenAmount,
  takerOrderId,
  transactionId,
  transaction
) => {
  if (
    !_.isBoolean(isSumTotallyMatched) ||
    _.isEmpty(makerOrders)
  ) {
    throw createError(500, 'Method updateMakerOrders has wrong arguments')
  }

  const matchedOrders = _.map(makerOrders, order => {
    return {
      parentId: takerOrderId,
      matchedOrderId: order.id,
      transactionId,
      baseTokenAmount: order.baseTokenAmount,
      quoteTokenAmount: order.quoteTokenAmount,
    }
  })

  if (!isSumTotallyMatched) {
    const lastOrder = _.last(makerOrders)
    const { baseTokenAmount, quoteTokenAmount } = getPartiallyUpdateAttributes(
      lastOrder,
      notMatchedBaseTokenAmount
    )

    _.dropRight(matchedOrders)

    matchedOrders.push({
      parentId: takerOrderId,
      matchedOrderId: lastOrder.id,
      transactionId,
      baseTokenAmount: lastOrder.initBaseTokenAmount - baseTokenAmount,
      quoteTokenAmount: lastOrder.initQuoteTokenAmount - quoteTokenAmount,
    })
  }

  return MatchedOrder.bulkCreate(matchedOrders, { transaction })
}

const updateMakerOrders = async (
  isSumTotallyMatched,
  matchedOrders,
  notMatchedBaseTokenAmount,
  transaction
) => {
  if (
    !_.isBoolean(isSumTotallyMatched) ||
    _.isEmpty(matchedOrders)
  ) {
    throw createError(500, 'Method updateMakerOrders has wrong arguments')
  }

  const ids = _.map(matchedOrders, 'id')

  if (isSumTotallyMatched) {
    await Order.update(orderFullFilledData, { where: { id: { [Op.in]: [...ids] } }, transaction })
    await emitDataChangedInOrdersByUser(matchedOrders, orderFullFilledData)
  } else {
    const orderPartiallyFilledData = getPartiallyUpdateAttributes(_.last(matchedOrders), notMatchedBaseTokenAmount)
    await Order.update(orderPartiallyFilledData, {
      where: { id: { [Op.in]: [_.last(ids)] } },
      transaction,
    })
    await emitDataChangedInOrdersByUser(_.last(matchedOrders), orderPartiallyFilledData)

    await Order.update(orderFullFilledData, {
      where: { id: { [Op.in]: _.dropRight(ids) } },
      transaction,
    })
    await emitDataChangedInOrdersByUser(_.dropRight(matchedOrders), orderFullFilledData)
  }
}

const updateMakerTakerOrders = async (
  newOrder,
  isBaseTokenAmountFilled,
  isSumTotallyMatched,
  matchedOrders,
  notMatchedBaseTokenAmount,
  transactionId,
) => {
  let transaction

  try {
    transaction = await sequelize.transaction()

    await updateTakerOrder(newOrder, isBaseTokenAmountFilled, notMatchedBaseTokenAmount, transaction)
    await updateMakerOrders(
      isSumTotallyMatched,
      matchedOrders,
      notMatchedBaseTokenAmount,
      transaction)
    await createMatchedOrders(
      isSumTotallyMatched,
      matchedOrders,
      notMatchedBaseTokenAmount,
      newOrder.id,
      transactionId,
      transaction
    )

    transaction.commit()
  } catch (e) {
    transaction && await transaction.rollback()
    console.error(`Attention! Failed to update matched orders after successful blockchain transaction!!!. ${e.message}`)
  }
}

const getBlockchainTransactionOptions = (newOrder, matchedOrders) => {
  const traderOrderParam = [
    newOrder.user.publicAddress,
    newOrder.baseTokenAmount.toString(),
    newOrder.quoteTokenAmount.toString(),
    newOrder.gasTokenAmount.toString(),
    newOrder.data,
    newOrder.signature,
  ]

  const makerOrderParams = matchedOrders.map(order => {
    return [
      order.user.publicAddress,
      order.baseTokenAmount.toString(),
      order.quoteTokenAmount.toString(),
      order.gasTokenAmount.toString(),
      order.data,
      order.signature,
    ]
  })

  const orderAddressSet = [newOrder.market.baseTokenAddress, newOrder.market.quoteTokenAddress, RELAYER]

  return {
    traderOrderParam,
    makerOrderParams,
    orderAddressSet,
  }
}

const setOrdersAsMatching = async (orders) => {
  if (!Array.isArray(orders) || _.isEmpty(orders)) throw Error('Cannot set orders as matching. Orders are empty')

  let transaction

  try {
    transaction = await sequelize.transaction()

    for (const { status, id } of orders) {
      await Order.update(
        { status: ORDER_STATUS.MATCHING, previousStatus: status },
        { where: { id }, transaction })
    }

    await emitDataChangedInOrdersByUser(orders, { status: ORDER_STATUS.MATCHING })

    transaction.commit()
  } catch (error) {
    transaction && await transaction.rollback()
    throw createError(500, `Failed to update order status to matching. ${error}`)
  }
}
const rollBackOrderStatus = async (orders) => {
  if (!Array.isArray(orders) || _.isEmpty(orders)) throw Error('Cannot roll back orders status. Orders are empty')

  let transaction

  try {
    transaction = await sequelize.transaction()

    for (const { status, id } of orders) {
      await Order.update(
        { status, previousStatus: null },
        { where: { id }, transaction })
    }

    transaction.commit()
  } catch (error) {
    transaction && await transaction.rollback()
    throw createError(500, `Failed to roll back orders status. ${error}`)
  }
}

const processMatchingOrders = async (
  newOrder,
  matchedOrders,
  isSumTotallyMatched,
  notMatchedBaseTokenAmount,
  baseTokenFilledAmounts,
  isBaseTokenAmountFilled,
) => {
  let transactionId

  try {
    const transactionOption = {
      ...getBlockchainTransactionOptions(newOrder, matchedOrders),
      baseTokenFilledAmounts,
    }

    transactionId = await sendTransaction(newOrder.id, transactionOption)
  } catch (e) {
    const ordersToRevert = [...matchedOrders, newOrder]
    await rollBackOrderStatus(ordersToRevert)

    for (const { id, status, userId } of ordersToRevert) {
      emitToUser(EVENT.ORDER_CHANGED, { id, status }, userId)
    }
    console.error(`Send transaction to blockchain failed: ${e.message}`)
    throw Error(e.message)
  }

  await updateMakerTakerOrders(
    newOrder,
    isBaseTokenAmountFilled,
    isSumTotallyMatched,
    matchedOrders,
    notMatchedBaseTokenAmount,
    transactionId
  )

  await emitNewTradeToHistory(transactionId)
}

export const getById = async (ctx, next) => {
  await next()
  const {
    params: { orderId },
  } = ctx
  const orderObject = await Order.findByPk(orderId)
  ctx.assert(!_.isNil(orderObject), 500, 'Order not found')
  ctx.status = 200
  ctx.body = orderObject
}

export const findUserOrders = async (ctx, next) => {
  await next()
  const {
    marketId,
  } = ctx.params

  const marketWhere = _.isNil(marketId) ? {} : { id: marketId }

  let orders = _.invokeMap(
    await Order.findAll({
      where: { userId: ctx.state.user.id },
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'side',
        'baseTokenAmount',
        'quoteTokenAmount',
        'initBaseTokenAmount',
        'initQuoteTokenAmount',
        'createdAt',
      ],
      include: {
        model: Market,
        attributes: ['tokens', 'baseTokenDecimals', 'quoteTokenDecimals'],
        where: marketWhere,
      },
    }), 'get', { plain: true })

  for (const order of orders) {
    const { baseTokenAmount, initBaseTokenAmount, initQuoteTokenAmount } = order
    const { baseTokenDecimals, quoteTokenDecimals } = order.market

    const amount = getAmount(baseTokenDecimals, initBaseTokenAmount)
    const availableAmount = getAmount(baseTokenDecimals, baseTokenAmount)
    const confirmedAmount = new BigNumber(amount).minus(availableAmount)
    const price = getPrice(quoteTokenDecimals, baseTokenDecimals, initQuoteTokenAmount, initBaseTokenAmount)

    order.amount = +amount
    order.price = +price
    order.availabelAmount = +amount
    order.confirmedAmount = +confirmedAmount

    delete order.baseTokenAmount
    delete order.initBaseTokenAmount
    delete order.quoteTokenAmount
    delete order.initQuoteTokenAmount
    delete order.signature
    delete order.market.baseTokenDecimals
    delete order.market.quoteTokenDecimals
  }

  ctx.body = orders
}

export const create = async (ctx, next) => {
  await next()

  const { tokens, trader, baseTokenAmount, quoteTokenAmount, gasTokenAmount, data, signature } = ctx.request.body
  const { publicAddress, id: userId } = ctx.state.user
  try {
    ctx.assert(web3.utils.isHex(data), 500, 'Data is not hex format')
    ctx.assert(data.length === 66, 500, 'Data has wrong length')

    const orderData = getOrderData(data)

    const {
      side,
      isMarketOrder,
      expiresAt,
      asMakerFeeRate,
      asTakerFeeRate,
    } = orderData.newOrderData

    ctx.assert(publicAddress === trader, 500, 'Wrong public address')

    const market = await Market.findOne({
      where: { tokens: { [Op.iLike]: tokens } },
      attributes: [
        'id',
        'baseTokenAddress',
        'quoteTokenAddress',
        'quoteTokenDecimals',
        'asMakerFeeRate',
        'asTakerFeeRate',
        'baseTokenDecimals',
      ],
    })
    ctx.assert(!_.isEmpty(market), 400, 'Market for given tokens not found')

    ctx.assert(!_.isNil(asMakerFeeRate) &&
      new BigNumber(market.asMakerFeeRate).isEqualTo(new BigNumber(asMakerFeeRate)),
    404, 'Maker fee rate is invalid')
    ctx.assert(!_.isNil(asMakerFeeRate) &&
      new BigNumber(market.asTakerFeeRate).isEqualTo(new BigNumber(asTakerFeeRate)),
    404, 'Taker fee rate is invalid')

    !isMarketOrder && !_.isNull(expiresAt) && await checkExpiresAtValid(expiresAt)

    const { minTokenAmount, maxTokenAmount } = await getMinMaxGasTokenAmount(market.baseTokenDecimals, baseTokenAmount)

    ctx.assert(
      !(new BigNumber(gasTokenAmount).isLessThan(new BigNumber(minTokenAmount))),
      404,
      'Gas token Amount is too low')
    ctx.assert(
      !(new BigNumber(gasTokenAmount).isGreaterThan(new BigNumber(maxTokenAmount))),
      404,
      'Gas Token Amount is too high')

    const traderOrderHash = await getTradeOrderHash(
      orderData.tradeOrder.version,
      trader,
      market.baseTokenAddress,
      market.quoteTokenAddress,
      baseTokenAmount,
      quoteTokenAmount,
      gasTokenAmount,
      orderData.tradeOrder.isSell,
      orderData.tradeOrder.isMarket,
      orderData.tradeOrder.expiredAtSeconds,
      orderData.tradeOrder.asMakerFeeRate,
      orderData.tradeOrder.asTakerFeeRate,
      orderData.tradeOrder.makerRebateRate,
      orderData.tradeOrder.salt
    )

    const isSignatureValid = isValidSignature(publicAddress, signature, traderOrderHash)
    ctx.assert(isSignatureValid, 400, 'Order signature is not valid')

    const newOrder = {
      side,
      isMarketOrder,
      baseTokenAmount,
      quoteTokenAmount,
      initBaseTokenAmount: baseTokenAmount,
      initQuoteTokenAmount: quoteTokenAmount,
      gasTokenAmount,
      data,
      signatureConfig: signature.config,
      signatureR: signature.r,
      signatureS: signature.s,
      expiresAt: expiresAt,
      status: ORDER_STATUS.PENDING,
      userId,
      marketId: market.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const newOrderId = _.get(await Order.create(newOrder), ['id'])

    await emitNewOrderToHistory(newOrderId)

    ctx.body = { id: newOrderId }
  } catch (e) {
    ctx.throw(e.status || 500, `Can't create order`, e.message)
  }
}

export const cancel = async (ctx, next) => {
  await next()
  const {
    params: { orderId },
  } = ctx
  try {
    const orderObject = await Order.findByPk(orderId)

    // Return: Promise<Array<affectedCount, affectedRows>>
    const updatedOrderData = await orderObject.update({ status: 'canceled' }, { returning: true })
    ctx.assert(updatedOrderData[0] === 1, 500, 'Order not canceled')
    ctx.status = 200
    ctx.body = updatedOrderData[1]
  } catch (e) {
    ctx.throw(500, `Can't cancel order`, e.message)
  }
}

export const findMatchOrders = async (ctx, next) => {
  await next()

  try {
    const { orderId } = ctx.params
    const { id: userId } = ctx.state.user

    const order = await getValidatedOrder(orderId, userId)

    const { baseTokenAmount } = order

    const limitOrders = await getLimitOrders(order, userId)
    ctx.assert(!_.isEmpty(limitOrders), 404, 'No limit orders with appropriate price')

    const {
      matchedOrderToProcess,
      isSumTotallyMatched,
      notMatchedBaseTokenAmount,
      baseTokenFilledAmounts,
      isBaseTokenAmountFilled,
    } = getMatchedOrders(baseTokenAmount, limitOrders)

    await setOrdersAsMatching([...matchedOrderToProcess, order])

    processMatchingOrders(
      order,
      matchedOrderToProcess,
      isSumTotallyMatched,
      notMatchedBaseTokenAmount,
      baseTokenFilledAmounts,
      isBaseTokenAmountFilled
    )

    ctx.status = 204
  } catch (e) {
    throw createError(e.status || 500, `Find matched orders failed: ${e.message}`)
  }
}
