import Router from 'koa-router'
import * as orderBookController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/history/:marketId', authMiddleware, orderBookController.getHistoryByMarketId)
  .get('/history', authMiddleware, orderBookController.getAllMarketsHistory)

export default router.routes()
