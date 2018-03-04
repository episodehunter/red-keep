import { map } from 'ramda'
import { Context, Db } from '../types/context.type'
import { EpisodeDefinitionType, EpisodeScrobble } from '../root-type'
import {
  findAllepisodesForShowInDb,
  addNewEpisodesInDb,
  removeEpisodesInDb,
  updateEpisodesInDb,
  registerEpisodeWatch
} from './episode.db.util'
import { splitEpisodeList, mapDatabaseEpisodeToDefinition } from './episode.resolve.util'
import { BadInput } from '../custom-error'

export function episodesUpdate(
  showId: number,
  removeMissingEpisodes: boolean,
  episodes: EpisodeDefinitionType[] | undefined,
  { db }: Context
) {
  if (!Array.isArray(episodes) || episodes.length === 0) {
    return Promise.resolve([])
  }
  return findAllepisodesForShowInDb(db, showId)
    .then(dbEpisodes => splitEpisodeList(dbEpisodes, episodes))
    .then(({ episodesToAdd, episodesToRemove, episodesToUpdate }) =>
      db.transaction(trx =>
        // Delete epsiodes before we add and update due to dublet problems
        Promise.resolve(
          removeMissingEpisodes &&
            removeEpisodesInDb(trx, episodesToRemove).then(
              n =>
                console.log(
                  `Removed ${episodesToRemove.length} episodes for show ${showId}`
                ) || n
            )
        ).then(() =>
          Promise.all([
            addNewEpisodesInDb(trx, showId, episodesToAdd).then(
              n =>
                console.log(
                  `Added ${episodesToAdd.length} episodes for show ${showId}`
                ) || n
            ),
            updateEpisodesInDb(trx, showId, episodesToUpdate).then(
              n =>
                console.log(
                  `Updated ${episodesToUpdate.length} episodes for show ${showId}`
                ) || n
            )
          ])
        )
      )
    )
}

export function findEpisodesForShow(db: Db, showId: number, onlyMissingImages: boolean) {
  return findAllepisodesForShowInDb(db, showId)
    .then(map(mapDatabaseEpisodeToDefinition))
    .then(
      result => (onlyMissingImages === true ? result.filter(epi => !epi.image) : result)
    )
}

export function scrobbleEpisode(db: Db, episode: EpisodeScrobble) {
  if (
    episode.episode > 0 &&
    episode.season > 0 &&
    episode.showId > 0 &&
    episode.userId > 0
  ) {
    return registerEpisodeWatch(db, episode)
  } else {
    throw new BadInput('Invalid episode to scrobble')
  }
}
