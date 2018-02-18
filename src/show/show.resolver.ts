import { Context } from '../types/context.type'
import { EpisodeResolver, episodesUpdate } from './episode/episode.resolver'
import { ShowDefinitionType } from './show.type'
import {
  getShowIdFromDb,
  updateShow,
  findShow,
  filterOutNonExistingShows
} from './show.db.util'

export async function mutateShow(
  {
    show,
    removeMissingEpisodes
  }: { show: Partial<ShowDefinitionType>; removeMissingEpisodes: true },
  context: Context
): Promise<ShowDefinitionType | null> {
  return getShowIdFromDb(context.db, show)
    .then(showId => updateShow(context.db, showId, show))
    .then(showId => episodesUpdate(showId, removeMissingEpisodes, show.episodes, context))
    .then(() => findShow(context.db, show))
}

export const ShowResolver = {
  RootQuery: {
    show(
      obj: void,
      args: { id?: number; tvdbId?: number; imdbId?: string },
      context: Context
    ) {
      return findShow(context.db, args)
    },

    existingShows(obj: void, args: { tvdbIds: number[] }, context: Context) {
      return filterOutNonExistingShows(context.db, args.tvdbIds)
    }
  },

  RootMutation: {
    showUpdate(
      obj,
      args: { show: Partial<ShowDefinitionType>; removeMissingEpisodes: true },
      context: Context
    ) {
      return mutateShow(args, context)
    }
  },

  Show: {
    episodes(obj, args, context) {
      return EpisodeResolver.episodes(obj, args, context)
    }
  }
}
