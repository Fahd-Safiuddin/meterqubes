import Router from 'koa-router'
import * as marketController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/', marketController.findByTokenName)
  .get('/:marketId', authMiddleware, marketController.getById)
  // add market, TODO add check for ADMIN role
  .post('/', authMiddleware, marketController.create)
  // update market, TODO add check for ADMIN role
  .patch('/:marketId', authMiddleware, marketController.modify)
  // delete market, TODO add check for ADMIN role
  .patch('/', authMiddleware, marketController.remove)

export default router.routes()
