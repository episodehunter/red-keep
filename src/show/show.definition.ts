export const ShowDefinition = `
  enum WeekDay {
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
    Sunday
  }

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
    airsDayOfWeek: WeekDay,
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
    airsDayOfWeek: WeekDay,
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
