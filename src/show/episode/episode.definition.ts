export const EpisodeDefinition = `
  type Episode {
    id: ID!,
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
    id: ID,
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
`
