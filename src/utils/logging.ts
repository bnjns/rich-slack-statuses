import * as winston from 'winston'

const isDevelopment = process.env.NODE_ENV === 'development'
const defaultFormats = [
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(info => `timestamp=${info.timestamp} level=${info.level} message=${info.message}`)
]
const colorize = winston.format.colorize({
  all: true
})

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: winston.format.combine(...(isDevelopment ? [colorize, ...defaultFormats] : defaultFormats)),
  transports: [
    new winston.transports.Console()
  ]
})

export default logger
