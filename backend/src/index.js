// const app = require('./lib/server')
import app from './lib/server'
const { APP_PORT: port = 3000 } = process.env

const server = app.listen(port, '0.0.0.0', function () {
  const address = server.address()
  console.info(`⊙ Open http://${address.address}:${address.port}/ in your browser ✨`)
})

module.exports = server
