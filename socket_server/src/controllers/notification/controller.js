import { notificationService } from '../../notification_service'

export const sendByUserId = async ctx => {
  const {
    userId,
    payload,
    event,
  } = ctx.request.body

  notificationService.emitToUser(userId, event, payload)
  ctx.status = 204
}

export const sendToAll = async ctx => {
  const {
    event,
    payload,
  } = ctx.request.body

  notificationService.emitToAll(event, payload)
  ctx.status = 204
}
