import Router from 'koa-router'
import users from './users/router'

const admin = new Router()

admin
  .use('/users', users)

module.exports = admin.routes()
