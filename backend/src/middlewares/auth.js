import { secret } from '../config/jwt'
import { verify } from 'jsonwebtoken'
import { get } from 'lodash'

export const authMiddleware = async (ctx, next) => {
  try {
    const token = ctx.request.headers['authorization']
    ctx.state.user = get(verify(token.replace('Bearer ', ''), secret), 'payload', {})
    return next()
  } catch (err) {
    ctx.status = 401
    ctx.body = {
      error: 'You must be authorized',
    }
  }
}
