export const ShowDefinition = `
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
`
