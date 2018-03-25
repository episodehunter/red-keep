import { Context } from './types/context.type'
import { ShowDefinitionType, EpisodeScrobble, FindUserInput } from './root-type'
import { findShow, filterOutNonExistingShows } from './show/show.db.util'
import { mutateShow, mutateAddShow } from './show/show.resolver'
import { findEpisodesForShow, scrobbleEpisode } from './episode/episode.resolver'
import { findApiUser } from './user/user.db.util'

function rw<A = any, O = void>(
  resolver: (obj: O, args: A, context: Context) => Promise<any>
) {
  return (obj, args, context: Context) => {
    context.logger.log('Start resolver: ' + resolver.name)
    return resolver(obj, args, context)
      .then(value => {
        context.logger.log('Resolver compleat: ' + resolver.name)
        return value
      })
      .catch(error => {
        context.logger.fatal(`Reolver (${resolver.name}) endeds with error: ${error}`)
        return Promise.reject(error)
      })
  }
}

type Ids = { id?: number; tvdbId?: number; imdbId?: string }

export const RootResolver = {
  RootQuery: {
    show: rw<Ids>(function show(obj, args, context) {
      return findShow(context.db, args)
    }),

    existingShows: rw<{ tvdbIds: number[] }>(function existingShows(obj, args, context) {
      return filterOutNonExistingShows(context.db, args.tvdbIds)
    }),

    findApiUser: rw<{ user: FindUserInput }>(function findApiUserRes(obj, args, context) {
      return findApiUser(context.db, args.user.username, args.user.apikey)
    })
  },

  RootMutation: {
    showUpdate: rw<{ show: Partial<ShowDefinitionType>; removeMissingEpisodes: true }>(
      function showUpdate(obj, args, context) {
        return mutateShow(args, context)
      }
    ),

    showAdd: rw<{ show: ShowDefinitionType }>(function showAdd(obj, args, context) {
      return mutateAddShow(args, context)
    }),

    scrobbleEpisode: rw<{ episode: EpisodeScrobble }>(function scrobbleEpisodeRes(
      obj,
      args,
      context
    ) {
      return scrobbleEpisode(context.db, args.episode).then(() => ({
        result: true
      }))
    })
  },

  Show: {
    episodes: rw<{ onlyMissingImages?: boolean }, ShowDefinitionType>(
      function episodesRes(obj, args, context) {
        return findEpisodesForShow(context.db, obj.id, args.onlyMissingImages) as Promise<
          any
        >
      }
    )
  }
}
