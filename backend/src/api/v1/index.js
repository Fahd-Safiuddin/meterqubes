import Router from 'koa-router'
import users from './users/router'
import orders from './orders/router'
import markets from './markets/router'
import auth from './authorization/router'
import data from './data/router'
import trade from './trade/router'
import orderBook from './orderBook/router'
import dashboard from './dashboard/router'
import chart from './chart/router'
import favorites from './favorites/router'
import admin from './admin'
const v1 = new Router()
v1.get('/', async (ctx, next) => {
  await next()
  ctx.body = 'Welcome to the S-PRO API boilerplate!'
})

v1.use('/users', users)
v1.use('/orders', orders)
v1.use('/markets', markets)

v1.use('/auth', auth)
v1.use('/data', data)
v1.use('/trade', trade)
v1.use('/order-book', orderBook)
v1.use('/dashboard', dashboard)
v1.use('/chart', chart)
v1.use('/favorites', favorites)
v1.use('/admin', admin)

module.exports = v1
