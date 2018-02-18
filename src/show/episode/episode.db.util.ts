import { Db } from '../../types/context.type'
import { EpisodeDefinitionType, EpisodeDatabaseType } from './episode.type'
import { mapDefinitionEpisodeToDatabase, getEpisodeId } from './episode.resolve.util'

const episodeTableName = 'tv_episode'

export function findAllepisodesInDb(db: Db, showId: number) {
  return db
    .select('*')
    .from(episodeTableName)
    .where('serie_id', showId)
}

export function addNewEpisodesInDb(
  db: Db,
  showId: number,
  episodes: EpisodeDefinitionType[]
): Promise<any> {
  if (episodes.length === 0) {
    return Promise.resolve()
  }
  return db(episodeTableName).insert(
    episodes.map(e => mapDefinitionEpisodeToDatabase(e, showId))
  ) as any
}

export function removeEpisodesInDb(
  db: Db,
  episodes: EpisodeDatabaseType[]
): Promise<any> {
  if (episodes.length === 0) {
    return Promise.resolve()
  }
  return db(episodeTableName)
    .whereIn('id', episodes.map(e => e.id))
    .delete() as any
}

export function updateEpisodesInDb(
  db: Db,
  showId: number,
  episodes: EpisodeDefinitionType[]
): Promise<any> {
  return Promise.all(
    episodes.map(e => mapDefinitionEpisodeToDatabase(e, showId)).map(episode =>
      db(episodeTableName)
        .update(episode)
        .where(getEpisodeId(episode))
    )
  )
}