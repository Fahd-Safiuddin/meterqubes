import winston from 'winston'
import moment from 'moment'

const isLocal = process.env.NODE_ENV === 'development'

const { timestamp, combine, printf } = winston.format

const defaultFormat = printf(
  info => `[${moment(info.timestamp).format('YYYY-MM-DD/h:mm:ss')}] ${info.message}`
)

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'out.log' }),
  ],
  exitOnError: false,
})

if (isLocal) {
  logger.add(
    new winston.transports.Console({
      format: combine(
        timestamp(),
        defaultFormat,
      ),
    }),
  )
}

export const log = (opts = {}) => {
  const {
    level = 'info',
    message,
  } = opts
  logger.log({ level, message })
}
