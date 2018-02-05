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

  type Show {
    id: ID!,
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
    episodes: [Episode]
  }
`
