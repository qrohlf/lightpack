import express from 'express'
import helmet from 'helmet'
import niceErrors from 'src/lib/middleware/niceErrors.js'
import logRequests from 'src/lib/middleware/logRequests.js'
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

  // authenticate user from headers
  // app.use(authenticate)

  // user-space routes go here
  configureRoutes(app)

  // report errors to Sentry in prod
  process.env.NODE_ENV === 'production' &&
    app.use(Sentry.Handlers.requestHandler())

  // final error fallback
  app.use((err, req, res) => {
    serverLog.error(err.stack)
    process.env.NODE_ENV === 'production'
      ? res.error.badRequest('An unknown server error occurred')
      : res.error.badRequest(err.message, err.stack)
  })

  return app
}
