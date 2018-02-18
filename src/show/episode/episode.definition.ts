export const EpisodeDefinition = `
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
`
