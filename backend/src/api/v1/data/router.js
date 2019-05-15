import Router from 'koa-router'
import * as dataController from './controller'
import { authMiddleware } from '../../../middlewares/auth'
const router = new Router()

router
  .get('/relayer', authMiddleware, dataController.getRelayer)

export default router.routes()
