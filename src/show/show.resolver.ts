import { Maybe } from 'monet'
import { Context } from '../types/context.type'
import { EpisodeResolver } from './episode/episode.resolver'
import { ShowDatabaseType, ShowDefinitionType } from './show.type'
import { safeStringSplit } from '../util'

function mapDatabaseShowToDefinition(show: ShowDatabaseType): ShowDefinitionType {
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
      obj: void,
      args: { id: number },
      context: Context
    ): Promise<ShowDefinitionType | null> => {
      return Maybe.fromNull(
        await context.db
          .first('*')
          .from('tv_show')
          .where('id', args.id)
      )
        .map(mapDatabaseShowToDefinition)
        .orNull()
    }
  },
  Show: {
    episodes: EpisodeResolver.episodes
  }
}
