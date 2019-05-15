
import Router from 'koa-router'
import * as userController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/', userController.getByPublicAddress)
  .get('/:userId', authMiddleware, userController.getById)
  .post('/', userController.create)
  .patch('/:userId', authMiddleware, userController.update)

export default router.routes()
