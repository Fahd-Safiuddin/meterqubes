import Router from 'koa-router'

import * as notificationController from './controller'

const router = new Router({ prefix: '/api/notification' })

router.post(
  '/sendToUser',
  notificationController.sendByUserId,
)

router.post(
  '/sendToAll',
  notificationController.sendToAll,
)

export default router.routes()
