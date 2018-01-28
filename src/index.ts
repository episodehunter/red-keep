import { makeExecutableSchema } from 'graphql-tools'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { json } from 'body-parser'
import * as express from 'express'
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
  resolvers: rootResolvers,
  allowUndefinedInResolve: false
})

const app = express()

app.use(
  '/graphql',
  json(),
  graphqlExpress(async req => {
    await new Promise(r => setTimeout(r, 5000))
    return {
      schema,
      context: {
        db: function() {
          return 5
        }
      }
    }
  })
)

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

const port = 4000
const hostname = 'localhost'
app.listen(port, hostname, () => {
  console.log(`Running a GraphQL API server at ${hostname}:${port}/graphql`)
})
