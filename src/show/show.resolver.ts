import { Maybe } from 'monet'
import { Context } from '../types/context.type'
import { EpisodeResolver, episodesUpdate } from './episode/episode.resolver'
import { ShowDefinitionType } from './show.type'
import {
  mapDefinitionToDatabaseShow,
  mapDatabaseShowToDefinition,
  getShowId
} from './show.resolve.util'

async function resolveShow(
  obj: void,
  args: { id?: number; tvdb_id?: number; imdb_id?: string },
  context: Context
): Promise<ShowDefinitionType | null> {
  return Maybe.fromNull(
    await context.db
      .first('*')
      .from('tv_show')
      .where(getShowId(args))
  )
    .map(mapDatabaseShowToDefinition)
    .orNull()
}

export async function mutateShow(
  obj: void,
  { show }: { show: Partial<ShowDefinitionType> },
  context: Context,
  _resolveShow = resolveShow,
  _episodesUpdate = episodesUpdate
): Promise<ShowDefinitionType | null> {
  return Promise.resolve(mapDefinitionToDatabaseShow(show))
    .then(dbShow =>
      Promise.all([
        context
          .db('tv_show')
          .update(dbShow)
          .where(getShowId(dbShow)),
        _episodesUpdate(show.episodes, context)
      ])
    )
    .then(() => _resolveShow(undefined, show, context))
}

export const ShowResolver = {
  RootQuery: {
    show: resolveShow
  },

  RootMutation: {
    showUpdate: mutateShow
  },

  Show: {
    episodes: EpisodeResolver.episodes
  }
}
