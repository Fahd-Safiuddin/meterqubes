import BigNumber from 'bignumber.js'
import _ from 'lodash'
import { ORDER_SIDE, ORDER_STATUS } from '../../constants/order'
import db from '../../models'
const {
  order: Order,
  market: Market,
  sequelize: { Op, literal },
} = db

export const getAmount = (baseTokenDecimals, baseTokenAmount) => {
  if (!baseTokenDecimals || !baseTokenAmount) return null

  return new BigNumber(baseTokenAmount).dividedBy(Math.pow(10, baseTokenDecimals))
}

export const getPrice = (quoteTokenDecimals, baseTokenDecimals, quoteTokenAmount, baseTokenAmount) => {
  if (!quoteTokenDecimals || !baseTokenDecimals || !quoteTokenDecimals || !baseTokenAmount) return null

  return new BigNumber(quoteTokenAmount)
    .dividedBy(new BigNumber(getAmount(baseTokenDecimals, baseTokenAmount)))
    .dividedBy(new BigNumber(Math.pow(10, quoteTokenDecimals)))
}

export const getOrderHistoryOptions = (marketId) => {
  let where = { status: { [Op.in]: [ORDER_STATUS.PENDING, ORDER_STATUS.MATCHING] } }

  if (!_.isNil(marketId)) {
    where.marketId = marketId
  }

  return {
    attributes: [
      'id',
      'side',
      'baseTokenAmount',
      'quoteTokenAmount',
      'userId',
      'marketId',
    ],
    order: [
      [[literal('"quoteTokenAmount"/"baseTokenAmount"'), 'DESC']],
      ['createdAt', 'ASC'],
    ],
    where,
    include: {
      model: Market,
      attributes: ['baseTokenDecimals', 'quoteTokenDecimals'],

    },
  }
}

export const getOrderHistory = async (orders, currentUserId, marketId) => {
  if (!Array.isArray(orders)) orders = [orders]

  let orderHistory = { marketId }

  orderHistory[ORDER_SIDE.BUY] = {}
  orderHistory[ORDER_SIDE.SELL] = {}

  for (const { side, baseTokenAmount, quoteTokenAmount, market, userId } of orders) {
    const amount = (getAmount(market.baseTokenDecimals, baseTokenAmount))
    const price = (getPrice(
      market.quoteTokenDecimals,
      market.baseTokenDecimals,
      quoteTokenAmount,
      baseTokenAmount,
    )).toFixed(2)

    if (!_.has(orderHistory[side], price)) orderHistory[side][price] = { amount: '0.00', myAmount: '0.00', price }

    orderHistory[side][price].amount = new BigNumber(orderHistory[side][price].amount)
      .plus(amount)

    if (userId === currentUserId) {
      orderHistory[side][price].myAmount = new BigNumber(orderHistory[side][price]
        .myAmount).plus(amount)
    }
  }

  orderHistory[ORDER_SIDE.BUY] = _.values(orderHistory[ORDER_SIDE.BUY])
  orderHistory[ORDER_SIDE.SELL] = _.values(orderHistory[ORDER_SIDE.SELL])

  return orderHistory
}

export const getOrderHistoryByOrderId = async (id) => {
  const options = getOrderHistoryOptions()

  const order = (await Order.findByPk(id, options)).get({ plain: true })
  const orderHistory = await getOrderHistory(order, order.userId, order.marketId)

  return { ...orderHistory, userId: order.userId }
}
