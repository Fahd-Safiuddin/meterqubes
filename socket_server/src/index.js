import fs from 'fs'
import http from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import convert from 'koa-convert'
import cors from 'koa2-cors'

import { log } from './utils/logger'

const app = new Koa()

export const server = http.createServer(app.callback())

process.on('unhandledRejection', e => console.log(e))

const { NODE_ENV } = process.env

app.use(
  convert(cors({ origin: true }))
).use(
  convert(bodyParser({ limit: '10mb' }))
)

fs.readdirSync(`${__dirname}/controllers`).forEach(controller => {
  try {
    app.use(
      require(`${__dirname}/controllers/${controller}/router.js`).default
    )
    log({ message: `LOADED ${controller} controller` })
  } catch (e) {
    log({ level: 'error', message: `Error while loading ${controller} - ${e}` })
  }
})

server.listen(4337, () => {
  log({ message: `MQ SOCKET SERVER IS RUNNING @ ${NODE_ENV} ENVIRONMENT` })
})
