import express from 'express'
import helmet from 'helmet'
import env from 'src/lib/env.js'
import niceErrors from 'src/lib/middleware/niceErrors.js'
import logRequests from 'src/lib/middleware/logRequests.js'
import headerAuth from 'src/lib/middleware/headerAuth.js'
import log from 'src/lib/log.js'

const serverLog = log('SERVER')

const app = express()

export default (configureRoutes) => {
  // error shortcuts
  app.use(niceErrors)

  // request logging
  app.use(logRequests)

  // security
  app.use(helmet())

  // parse JSON bodies
  app.use(express.json())

  // header auth
  app.use(headerAuth)

  // authenticate user from headers
  // app.use(authenticate)

  // user-space routes go here
  configureRoutes(app)

  // report errors to Sentry in prod
  env.NODE_ENV === 'production' && app.use(Sentry.Handlers.requestHandler())

  // final error fallback
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }

    serverLog.error(err.stack)
    env.NODE_ENV === 'production'
      ? res.error.badRequest('An unknown server error occurred')
      : res.error.badRequest(err.message, err.stack)
  })

  return app
}
