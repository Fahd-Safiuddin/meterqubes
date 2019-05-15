import * as express from 'express'
import * as next from 'next'
import nextI18NextMiddleware from 'next-i18next/middleware'

const dotenv = require('dotenv')
dotenv.config()

import nextI18next from './src/utils/i18n'

const port = process.env.PORT || 3000
const app = next({ dir: './src', dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()
;(async () => {
  await app.prepare()
  const server = express()

  server.use(nextI18NextMiddleware(nextI18next))

  server.get('*', (req, res) => handle(req, res))

  server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
})()
