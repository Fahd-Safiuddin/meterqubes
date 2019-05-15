import Router from 'koa-router'
import * as userController from './controller'
import { authMiddleware } from '../../../../middlewares/auth'
const router = new Router()

router
  .get('/wallets', authMiddleware, userController.getUserWallets)

export default router.routes()
