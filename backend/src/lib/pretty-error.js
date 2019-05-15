const path = require('path')
const PrettyError = require('pretty-error')
const pe = new PrettyError()

// Skip events.js and http.js and similar core node files
pe.skipNodeFiles()

// Skip the global error middleware
pe.skipPath(path.resolve('src/middlewares/errorHandler.js'))

// Skip all the trace lines that starts with 'koa'
/* pe.skip(({ packageName }) =>
  typeof packageName !== 'undefined' && packageName.startsWith('koa')) */

// Or skip specific package
// pe.skipPackage('koa')
// pe.skipPackage('koa-compose')
// pe.skipPackage('koa-router')

module.exports = pe
