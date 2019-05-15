import Router from 'koa-router'
import * as orderController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/order/:orderId', authMiddleware, orderController.getById)
  .post('/', authMiddleware, orderController.create)
  .patch('/:orderId', authMiddleware, orderController.cancel)
  .get('/user/:marketId', authMiddleware, orderController.findUserOrders)
  .put('/match/:orderId', authMiddleware, orderController.findMatchOrders)

export default router.routes()
