import { makeExecutableSchema } from 'graphql-tools'
import { RootResolver } from './root-resolver'

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
    showAdd(show: ShowInput!): Show
    scrobbleEpisode(episode: ScrobbleEpisodeInput!): ScrobbleEpisodeResult
  }
`

const Definitions = `
  type ShowIds {
    id: Int!,
    tvdbId: Int!,
    imdbId: String
  }

  type Show {
    id: Int!,
    tvdbId: Int!,
    imdbId: String,
    name: String!,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: String,
    genre: [String],
    language: String,
    network: String,
    overview: String,
    runtime: Int,
    ended: Boolean,
    fanart: String,
    poster: String,
    lastupdate: Int,
    episodes(onlyMissingImages: Boolean): [Episode]
  }

  input ShowInput {
    id: Int,
    tvdbId: Int,
    imdbId: String,
    name: String!,
    airsDayOfWeek: String,
    airsTime: String,
    firstAired: String,
    genre: [String],
    language: String,
    network: String,
    overview: String,
    runtime: Int,
    ended: Boolean!,
    fanart: String,
    poster: String,
    lastupdate: Int!,
    episodes: [EpisodeInput]
  }

  type Episode {
    id: Int!,
    tvdbId: Int!,
    serieId: Int!,
    name: String!,
    season: Int!,
    episode: Int!,
    firstAired: String,
    overview: String,
    image: String,
    lastupdated: Int!
  }

  input EpisodeInput {
    id: Int,
    tvdbId: Int!,
    serieId: Int,
    name: String!,
    season: Int!,
    episode: Int!,
    firstAired: String,
    overview: String,
    image: String,
    lastupdated: Int!
  }

  input ScrobbleEpisodeInput {
    userId: Int!
    showId: Int!
    season: Int!
    episode: Int!
  }

  type ScrobbleEpisodeResult {
    result: Boolean!
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [SchemaDefinition, RootQuery, RootMutation, Definitions],
  resolvers: RootResolver,
  allowUndefinedInResolve: false
})
