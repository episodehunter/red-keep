import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'
import * as express from 'express'
import * as Raven from 'raven'
import { engineSetup } from './engine'
import { Context } from './types/context.type'
import { connect } from './database'
import { config } from './config'
import { schema } from './root-schema'
import { getLogger } from './logger'

const createJwtCheck = () =>
  jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://episodehunter.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'https://episodehunter.auth0.com/api/v2/',
    issuer: 'https://episodehunter.auth0.com/',
    algorithms: ['RS256']
  })

const noop = (req: any, res: any, next: any) => next()
const checkJwt = config.inDevelopMode ? noop : createJwtCheck()

function formatError(error: any) {
  const errorId = Math.random()
  const errorObj = {
    errorId,
    code: (error.originalError && error.originalError.name) || 'Error',
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  }
  console.error(errorObj)

  if (config.inDevelopMode) {
    return errorObj
  }
  Raven.captureException(error.orginalError || errorObj)
  return {
    message: error.message || 'This was bad',
    errorId,
    code: (error.originalError && error.originalError.name) || 'Error'
  }
}

const app = express()

engineSetup(app)

if (!config.inDevelopMode) {
  Raven.config(`https://${config.raven.dsn}@sentry.io/${config.raven.project}`, {
    autoBreadcrumbs: false
  }).install()
  app.use(Raven.requestHandler())
}

app.get('/', (req, res) => {
  res.send('Red keep')
})

app.use(
  '/graphql',
  checkJwt,
  json({ limit: '500kb' }),
  graphqlExpress(req => ({
    schema,
    context: {
      db: connect(),
      logger: getLogger(String(req.headers['request-id']))
    } as Context,
    formatError,
    tracing: true,
    cacheControl: false
  }))
)

if (config.inDevelopMode) {
  // GraphiQL, a visual editor for queries
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
}

app.use(Raven.errorHandler())

app.use((err: any, req: any, res: any, next: any) => {
  if (err.status !== 401) {
    console.error(err)
  }
  res.status(err.status || 500).send()
})

const hostname = 'localhost'
app.listen(config.port, hostname, () => {
  console.log(`Running a GraphQL API server at ${hostname}:${config.port}/graphql`)
})
