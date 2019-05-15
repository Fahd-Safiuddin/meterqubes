
import Router from 'koa-router'
import * as authController from './controller'
const router = new Router()

router
  .post('/', authController.create)

export default router.routes()
