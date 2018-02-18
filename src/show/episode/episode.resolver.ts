import { map } from 'ramda'
import { ShowDefinitionType } from '../show.type'
import { Context } from '../../types/context.type'
import { EpisodeDefinitionType } from './episode.type'
import {
  findAllepisodesInDb,
  addNewEpisodesInDb,
  removeEpisodesInDb,
  updateEpisodesInDb
} from './episode.db.util'
import { splitEpisodeList, mapDatabaseEpisodeToDefinition } from './episode.resolve.util'

export function episodesUpdate(
  showId: number,
  removeMissingEpisodes: boolean,
  episodes: EpisodeDefinitionType[] | undefined,
  { db }: Context
) {
  if (!Array.isArray(episodes) || episodes.length === 0) {
    return Promise.resolve([])
  }
  return findAllepisodesInDb(db, showId)
    .then(dbEpisodes => splitEpisodeList(dbEpisodes, episodes))
    .then(({ episodesToAdd, episodesToRemove, episodesToUpdate }) =>
      db.transaction(trx =>
        // Delete epsiodes before we add and update due to dublet problems
        Promise.resolve(
          removeMissingEpisodes &&
            removeEpisodesInDb(trx, episodesToRemove).then(
              n => console.log(`Removed ${episodesToRemove.length} episodes`) || n
            )
        ).then(() =>
          Promise.all([
            addNewEpisodesInDb(trx, showId, episodesToAdd).then(
              n => console.log(`Added ${episodesToAdd.length} episodes`) || n
            ),
            updateEpisodesInDb(trx, showId, episodesToUpdate).then(
              n => console.log(`Updated ${episodesToUpdate.length} episodes`) || n
            )
          ])
        )
      )
    )
}

export const EpisodeResolver = {
  episodes: (
    show: ShowDefinitionType,
    args: { onlyMissingImages?: boolean },
    context: Context
  ) => {
    return findAllepisodesInDb(context.db, show.id)
      .then(map(mapDatabaseEpisodeToDefinition))
      .then(
        result =>
          args.onlyMissingImages === true ? result.filter(epi => !epi.image) : result
      )
  }
}
