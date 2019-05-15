// https://github.com/koajs/koa/wiki/Error-Handling
module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = err
    if (parseInt(ctx.status, 10) === 401) {
      ctx.body = 'Protected resource, use Authorization header to get access\n'
    }
    ctx.app.emit('error', err, ctx)
  }
}
