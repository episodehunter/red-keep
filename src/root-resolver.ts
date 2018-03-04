import { Context } from './types/context.type'
import { ShowDefinitionType, EpisodeScrobble, FindUserInput } from './root-type'
import { findShow, filterOutNonExistingShows } from './show/show.db.util'
import { mutateShow, mutateAddShow } from './show/show.resolver'
import { findEpisodesForShow, scrobbleEpisode } from './episode/episode.resolver'
import { findApiUser } from './user/user.db.util'

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
    },

    findApiUser(obj: void, args: { user: FindUserInput }, context: Context) {
      return findApiUser(context.db, args.user.username, args.user.apikey)
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
      return scrobbleEpisode(context.db, args.episode).then(() => ({
        result: true
      }))
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
