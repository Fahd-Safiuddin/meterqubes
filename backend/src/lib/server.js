
import Koa from 'koa'
import cors from '@koa/cors'
import compress from 'koa-compress'
import Router from 'koa-router'
import { oas } from 'koa-oas3'
import koaBody from 'koa-body'

import pe from './pretty-error'

import corsConfig from '../config/cors.config'
import compressConfig from '../config/compress.config'
import oasConfig from '../config/oas.config'

import errorHandler from '../middlewares/errorHandler'
require('./bluebird')
require('dotenv').config()

const router = new Router()

// Configuration
// =====================================================================================================================
const { NODE_ENV } = process.env
const isDevelopment = NODE_ENV === 'development'

// API
// =====================================================================================================================
const app = new Koa()

if (isDevelopment) {
  const logger = require('koa-logger')
  app.use(logger())
}

const { v1: apiV1 } = require('../api') // users, upload, download
router.use('/api/v1', apiV1.routes())

app
  .use(cors(corsConfig))
  .use(compress(compressConfig))
  .use(koaBody())
  .use(errorHandler).on('error', (err, ctx) => { console.error(pe.render(err)) })
  .use(router.routes())
  .use(router.allowedMethods())
  .use(oas(oasConfig))

module.exports = app
