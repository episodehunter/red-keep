import { Context } from './types/context.type'
import { ShowDefinitionType, EpisodeScrobble } from './root-type'
import { findShow, filterOutNonExistingShows } from './show/show.db.util'
import { mutateShow, mutateAddShow } from './show/show.resolver'
import { findEpisodesForShow } from './episode/episode.resolver'

export const RootResolver = {
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
    },
    showAdd(obj, args: { show: ShowDefinitionType }, context: Context) {
      return mutateAddShow(args, context)
    },
    scrobbleEpisode: (
      obj: void,
      args: { episode: EpisodeScrobble },
      context: Context
    ) => {
      return null
    }
  },

  Show: {
    episodes: (
      show: ShowDefinitionType,
      args: { onlyMissingImages?: boolean },
      context: Context
    ) => {
      return findEpisodesForShow(context.db, show.id, args.onlyMissingImages)
    }
  }
}
