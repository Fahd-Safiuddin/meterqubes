import db from '../../../models'
import _ from 'lodash'
import { getOrderHistory, getOrderHistoryOptions } from '../../../helpers/order'
import { getMarketsDashboardData } from '../../../helpers/trade'

const {
  order: Order,
} = db

export const getHistoryByMarketId = async (ctx, next) => {
  await next()

  const {
    marketId,
  } = ctx.params

  const options = getOrderHistoryOptions(marketId)

  const orders = _.invokeMap(await Order.findAll(options), 'get', { plain: true })

  ctx.body = await getOrderHistory(orders, ctx.state.user.id, marketId)
}

export const getAllMarketsHistory = async (ctx, next) => {
  await next()

  ctx.body = await getMarketsDashboardData()
}
