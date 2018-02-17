import { ShowStatusType, ShowDatabaseType, ShowDefinitionType } from './show.type'
import { safeStringSplit } from '../util'

export function convertStatusBoleanToString(ended?: boolean): ShowStatusType | undefined {
  if (typeof ended === 'boolean') {
    return ended ? 'Ended' : 'Continuing'
  }
  return undefined
}

export function convertGenreArrayToString(genre: string[]) {
  return Array.isArray(genre) ? genre.join('|') : undefined
}

export function getShowId(
  ids: Partial<{
    id: number
    tvdb_id: number
    imdb_id: string
    tvdbId: number
    imdbId: string
  }>
) {
  const { id, tvdb_id, imdb_id, imdbId, tvdbId } = ids
  if (id) {
    return { id }
  } else if (tvdb_id || tvdbId) {
    return { tvdb_id: tvdb_id || tvdbId }
  } else if (imdb_id || imdbId) {
    return { imdb_id: imdb_id || imdbId }
  }
  throw new Error('Missing id for updating show')
}

export function mapDatabaseShowToDefinition(show: ShowDatabaseType): ShowDefinitionType {
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
    runtime: show.runtime,
    ended: show.status === 'Ended',
    fanart: show.fanart,
    poster: show.poster,
    lastupdate: show.lastupdate
  }
}

export function mapDefinitionToDatabaseShow(
  show: Partial<ShowDefinitionType>
): Partial<ShowDatabaseType> {
  return {
    id: show.id,
    tvdb_id: show.tvdbId,
    imdb_id: show.imdbId,
    name: show.name,
    airs_dayOfWeek: show.airsDayOfWeek,
    airs_time: show.airsTime,
    first_aired: show.firstAired,
    genre: convertGenreArrayToString(show.genre),
    language: show.language,
    network: show.network,
    overview: show.overview,
    runtime: show.runtime,
    status: convertStatusBoleanToString(show.ended),
    fanart: show.fanart,
    poster: show.poster,
    lastupdate: show.lastupdate
  }
}

export function assertValue(msg: string) {
  return (value?: any) => {
    if (value) {
      return value
    }
    throw new Error(msg)
  }
}
