import * as Logger from 'logdna'
import * as Raven from 'raven'
import { config } from './config'

export interface Logger {
  log: (message: string) => void
  fatal: (message: string) => void
}

const options = {
  app: 'red-keep',
  env: process.env.NODE_ENV,
  index_meta: true
}

let dnaLogger

export function getLogger(requestId: string): Logger {
  if (config.inDevelopMode) {
    return {
      log: (message: string) => console.log(message, requestId),
      fatal: (message: string) => console.error(message, requestId)
    }
  }
  if (!dnaLogger) {
    dnaLogger = Logger.setupDefaultLogger(config.logDna.apiKey, options)
  }
  return {
    log(message: string) {
      Raven.captureBreadcrumb({
        category: 'log',
        message,
        requestId
      })
      dnaLogger.log(message, {
        meta: { requestId }
      })
    },
    fatal(message: string) {
      Raven.captureBreadcrumb({
        category: 'fatal',
        message,
        requestId
      })
      dnaLogger.log(message, {
        meta: { requestId }
      })
    }
  }
}
