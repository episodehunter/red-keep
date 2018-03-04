export type ShowStatusType = 'Continuing' | 'Ended'

export type EpisodeDatabaseType = {
  id: number
  tvdb_id: number
  serie_id: number
  name: string
  season: number
  episode: number
  first_aired: string
  overview: string
  image: string
  lastupdated: number
}

export type EpisodeDefinitionType = {
  id: number
  tvdbId: number
  serieId: number
  name: string
  season: number
  episode: number
  firstAired: string
  overview: string
  image: string
  lastupdated: number
}

export type EpisodeScrobble = {
  userId: number
  showId: number
  season: number
  episode: number
}

export type ShowDatabaseType = {
  id: number
  tvdb_id: number
  imdb_id: string
  name: string
  airs_dayOfWeek: string
  airs_time: string
  first_aired: string
  genre: string
  language: string
  network: string
  overview: string
  runtime: number
  status: ShowStatusType
  fanart: string
  poster: string
  lastupdate: number
}

export type ShowDefinitionType = {
  id: number
  tvdbId: number
  imdbId: string
  name: string
  airsDayOfWeek: string
  airsTime: string
  firstAired: string
  genre: string[]
  language: string
  network: string
  overview: string
  runtime: number
  ended: boolean
  fanart: string
  poster: string
  episodes?: EpisodeDefinitionType[]
  lastupdate: number
}
