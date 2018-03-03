import { makeExecutableSchema } from 'graphql-tools'
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

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, RootMutation, ...ShowDefinitions],
  resolvers: rootResolvers as any,
  allowUndefinedInResolve: false
})
