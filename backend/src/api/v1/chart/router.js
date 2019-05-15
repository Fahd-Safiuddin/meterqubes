import Router from 'koa-router'
import * as chartController from './controller'
const router = new Router()

router
  .get('/', chartController.getData)

export default router.routes()
