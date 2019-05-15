import { getTradeDashboardData, getLandingDashboardData } from '../../../helpers/trade'

export const getTradeData = async (ctx, next) => {
  await next()

  const { marketId } = ctx.params

  const data = await getTradeDashboardData(marketId)
  ctx.body = data
}

export const getLandingData = async (ctx, next) => {
  await next()

  ctx.body = await getLandingDashboardData()
}
