import { makeExecutableSchema } from 'graphql-tools'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as express from 'express'
import { Context } from './types/context.type'
import { connect } from './database'
import { ShowDefinitions, ShowResolver } from './show/show'

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`

const RootQuery = `
  type RootQuery {
    show(id: ID!): Show
  }
`

const rootResolvers = ShowResolver

const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, ...ShowDefinitions],
  resolvers: rootResolvers as any,
  allowUndefinedInResolve: false
})

const app = express()

app.use(
  '/graphql',
  json(),
  graphqlExpress(req => ({
    schema,
    context: {
      db: connect()
    } as Context
  }))
)

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

const port = 4000
const hostname = 'localhost'
app.listen(port, hostname, () => {
  console.log(`Running a GraphQL API server at ${hostname}:${port}/graphql`)
})
