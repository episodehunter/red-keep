import { makeExecutableSchema } from 'graphql-tools'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'
import * as express from 'express'
import { Context } from './types/context.type'
import { connect } from './database'
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
  return {
    message: 'This was bad',
    errorId
  }
}

const app = express()

app.use(
  '/graphql',
  json(),
  checkJwt,
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
