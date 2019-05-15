const pe = require('../lib/pretty-error')

const DEFAULT_DATABASE = 'postgres'
const ARGUMENT_VALUES = { INIT: 'init', DROP: 'drop' }

const [, , argument = ARGUMENT_VALUES.INIT] = process.argv
const env = process.env.NODE_ENV || 'development'
const { username: user, host, password, database } = require('../config/sequelize.config')[env]

const config = { user, host, database: DEFAULT_DATABASE, password }

const { isBluebirdPromise } = require('../helpers/promises')
const Promise = isBluebirdPromise() ? global.Promise : require('bluebird')

const pg = require('pg')
Promise.promisifyAll(pg)

const client = new pg.Client(config)

const {
  dropDatabase,
  createDatabase,
  alterDatabase,
} = require('./api')(client, database)

let handler = null
switch (argument) {
  case ARGUMENT_VALUES.INIT:
    handler = () => dropDatabase()
      .then(createDatabase)
      .then(alterDatabase)
    break
  case ARGUMENT_VALUES.DROP:
    handler = () => dropDatabase(true)
    break
  default:
    throw new TypeError(`Invalid argument. Possible values are "${ARGUMENT_VALUES}"`)
}

client
  .connect()
  .then(handler)
  .catch(err => { console.error(pe.render(err)); process.exit(1) })
  .finally(() => client.end())
