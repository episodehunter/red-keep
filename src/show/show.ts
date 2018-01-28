import { Maybe } from 'monet'
import { Context } from '../types/context.type'
import { EpisodeDefinition, EpisodeResolver } from './episode'

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

  enum ShowStatus {
    Ended
    Continuing
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

type ShowStatus = 'Continuing' | 'Ended'

type ShowDatabase = {
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
  runtime: string
  status: ShowStatus
  fanart: string
  poster: string
  lastupdate: number
}

type ShowDefinition = {
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
  lastupdate: number
}

function safeStringSplit(str: string, key: string) {
  if (!str || !str.split) {
    return []
  }
  return str.split(key)
}

function mapDatabaseShowToDefinition(show: ShowDatabase): ShowDefinition {
  return {
    id: show.id,
    tvdbId: show.tvdb_id,
    imdbId: show.imdb_id,
    name: show.name,
    airsDayOfWeek: show.airs_dayOfWeek,
    airsTime: show.airs_time,
    firstAired: show.first_aired,
    genre: safeStringSplit(show.genre, '|'),
    language: show.language,
    network: show.network,
    overview: show.overview,
    runtime: Number(show.runtime),
    ended: show.status === 'Ended',
    fanart: show.fanart,
    poster: show.poster,
    lastupdate: show.lastupdate
  }
}

export const ShowResolver = {
  RootQuery: {
    show: async (
      obj: any,
      args: { id: number },
      context: Context
    ): Promise<ShowDefinition | null> => {
      return Maybe.fromNull(
        await context.db
          .first('*')
          .from('tv_show')
          .where('id', args.id)
          .then(result => result || null)
      )
        .map(mapDatabaseShowToDefinition)
        .orNull()
    }
  },
  Show: {
    episodes: EpisodeResolver.episodes
  }
}

export const ShowDefinitions = [ShowDefinition, EpisodeDefinition]
