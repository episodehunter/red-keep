import { EpisodeDefinitionType } from './episode/episode.type'
export type ShowStatusType = 'Continuing' | 'Ended'

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
