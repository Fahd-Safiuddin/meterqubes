import _ from 'lodash'
import { getTradeHistory, getTradeHistoryAllTransactions, getUserTradeHistory } from '../../../helpers/trade'
import db from '../../../models'
const { market: Market } = db

export const getHistory = async (ctx, next) => {
  await next()

  const { marketId } = ctx.params
  const market = await Market.findByPk(marketId, { attributes: ['id'] })
  ctx.assert(!_.isNil(market), 404, 'Market not found')

  const transactions = await getTradeHistoryAllTransactions(marketId)

  let tradeHistory = { marketId }
  tradeHistory.data = _.isEmpty(transactions) ? {} : await getTradeHistory(transactions)

  ctx.body = tradeHistory
}

export const getUserHistory = async (ctx, next) => {
  await next()

  const { marketId } = ctx.params
  const market = await Market.findByPk(marketId, { attributes: ['id'] })
  ctx.assert(!_.isNil(market), 404, 'Market not found')

  ctx.body = await getUserTradeHistory(marketId, ctx.state.user.id)
}
