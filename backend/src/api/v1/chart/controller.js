import { getChartData } from '../../../helpers/trade'
import db from '../../../models'
import _ from 'lodash'
const {
  market: Market,
} = db

export const getData = async (ctx, next) => {
  await next()

  const { marketId, period } = ctx.query

  const market = await Market.findByPk(marketId, { attributes: ['id', 'baseTokenDecimals'] })
  ctx.assert(!_.isNil(market), 404, 'Market not found')

  ctx.body = await getChartData(market, period)
}
