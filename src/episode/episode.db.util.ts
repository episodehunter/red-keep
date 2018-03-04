import { Db, DbTransaction } from '../types/context.type'
import { EpisodeDefinitionType, EpisodeDatabaseType, EpisodeScrobble } from '../root-type'
import { mapDefinitionEpisodeToDatabase, getEpisodeId } from './episode.resolve.util'

const episodeTableName = 'tv_episode'
const episodeWatchedTableName = 'tv_watched'

export function findAllepisodesForShowInDb(db: Db, showId: number) {
  return db
    .select('*')
    .from(episodeTableName)
    .where('serie_id', showId)
}

export function addNewEpisodesInDb(
  db: DbTransaction,
  showId: number,
  episodes: EpisodeDefinitionType[]
): Promise<any> {
  if (episodes.length === 0) {
    return Promise.resolve()
  }
  return db
    .batchInsert(
      episodeTableName,
      episodes.map(e => mapDefinitionEpisodeToDatabase(e, showId))
    )
    .transacting(db) as any
}

export function removeEpisodesInDb(
  db: DbTransaction,
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
  db: DbTransaction,
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

export function registerEpisodeWatch(db: Db, episode: EpisodeScrobble): Promise<any> {
  /*
    xbmc_scrobble: 0
    xbmc_sync: 1
    check_in: 2
    check_in_season: 3
    plex_scrobble: 4
  */
  return db(episodeWatchedTableName).insert({
    user_id: episode.userId,
    serie_id: episode.showId,
    season: episode.season,
    episode: episode.episode,
    type: 4,
    time: (Date.now() / 1000) | 0
  }) as any
}
