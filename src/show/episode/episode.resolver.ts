import { map } from 'ramda'
import { ShowDefinitionType } from '../show.type'
import { Context } from '../../types/context.type'
import { EpisodeDataBaseType, EpisodeDefinitionType } from './episode.type'

function mapDatabaseEpisodeToDefinition(
  episode: EpisodeDataBaseType
): EpisodeDefinitionType {
  return {
    id: episode.id,
    tvdbId: episode.tvdb_id,
    serieTvdbId: episode.serie_tvdb_id,
    serieId: episode.serie_id,
    name: episode.name,
    season: episode.season,
    episode: episode.episode,
    firstAired: episode.first_aired,
    overview: episode.overview,
    image: episode.image,
    lastupdated: episode.lastupdated
  }
}

function mapDefinitionEpisodeToDatabase(
  episode: Partial<EpisodeDefinitionType>
): Partial<EpisodeDataBaseType> {
  return {
    id: episode.id,
    tvdb_id: episode.tvdbId,
    serie_tvdb_id: episode.serieTvdbId,
    serie_id: episode.serieId,
    name: episode.name,
    season: episode.season,
    episode: episode.episode,
    first_aired: episode.firstAired,
    overview: episode.overview,
    image: episode.image,
    lastupdated: episode.lastupdated
  }
}

function getEpisodeId(episode: Partial<EpisodeDataBaseType>) {
  const { id, tvdb_id } = episode
  if (id) {
    return { id }
  } else if (tvdb_id) {
    return { tvdb_id }
  }
  throw new Error('Missing id for updating episode')
}

export function episodesUpdate(
  episodes: Partial<EpisodeDefinitionType>[] | undefined,
  { db }: Context
) {
  if (!Array.isArray(episodes)) {
    return Promise.resolve([])
  }
  return Promise.all(
    episodes.map(mapDefinitionEpisodeToDatabase).map(episode =>
      db('tv_episode')
        .update(episode)
        .where(getEpisodeId(episode))
    )
  )
}

export const EpisodeResolver = {
  episodes: (show: ShowDefinitionType, args: {}, context: Context) => {
    return context.db
      .select('*')
      .from('tv_episode')
      .where('serie_id', show.id)
      .then(map(mapDatabaseEpisodeToDefinition))
  }
}
