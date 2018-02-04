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

export const EpisodeResolver = {
  episodes: (show: ShowDefinitionType, args: {}, context: Context) => {
    return context.db
      .select('*')
      .from('tv_episode')
      .where('serie_id', show.id)
      .then(map(mapDatabaseEpisodeToDefinition))
  }
}
