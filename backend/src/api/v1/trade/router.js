import Router from 'koa-router'
import * as tradeController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/history/:marketId', tradeController.getHistory)
  .get('/user-history/:marketId', authMiddleware, tradeController.getUserHistory)

export default router.routes()
