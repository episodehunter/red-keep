import { makeExecutableSchema } from 'graphql-tools'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'
import * as express from 'express'
import * as Raven from 'raven'
import { Context } from './types/context.type'
import { connect } from './database'
import { config } from './config'
import { ShowDefinitions, ShowResolver } from './show'

const SchemaDefinition = `
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`

const RootQuery = `
  type RootQuery {
    show(id: ID, tvdbId: Int, imdbId: String): Show
    existingShows(tvdbIds: [Int]!): [ShowIds]
  }
`

const RootMutation = `
  type RootMutation {
    showUpdate(show: ShowInput!, removeMissingEpisodes: Boolean = true): Show
  }
`

const rootResolvers = ShowResolver

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, RootMutation, ...ShowDefinitions],
  resolvers: rootResolvers as any,
  allowUndefinedInResolve: false
})

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
const inDevelopMode = process.env.NODE_ENV === 'develop'
const checkJwt = inDevelopMode ? noop : createJwtCheck()

function formatError(error: any) {
  const errorId = Math.random()
  const errorObj = {
    errorId,
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path
  }
  console.error(errorObj)

  if (inDevelopMode) {
    return errorObj
  }
  Raven.captureException(errorObj)
  return {
    message: 'This was bad',
    errorId
  }
}

if (inDevelopMode) {
  Raven.config(`https://${config.raven.dsn}@sentry.io/${config.raven.project}`, {
    autoBreadcrumbs: false
  }).install()
}

const app = express()

app.use(Raven.requestHandler())

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
      db: connect()
    } as Context,
    formatError
  }))
)

if (inDevelopMode) {
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

const port = 4000
const hostname = 'localhost'
app.listen(port, hostname, () => {
  console.log(`Running a GraphQL API server at ${hostname}:${port}/graphql`)
})
