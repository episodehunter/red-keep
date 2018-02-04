export const EpisodeDefinition = `
  type Episode {
    id: ID!,
    tvdbId: Int!,
    serieTvdbId: Int!,
    serieId: Int!,
    name: String!,
    season: Int!,
    episode: Int!,
    firstAired: String,
    overview: String,
    image: String,
    lastupdated: Int!
  }
`
