import Router from 'koa-router'
import * as dashboardController from './controller'
const router = new Router()

router
  .get('/trade/:marketId', dashboardController.getTradeData)
  .get('/landing', dashboardController.getLandingData)

export default router.routes()
