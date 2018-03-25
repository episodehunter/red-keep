import { Maybe } from 'monet'
import { BadInput, ShowExistError, ShowNotExistError } from '../custom-error'
import { Db } from '../types/context.type'
import { addNewEpisodesInDb } from '../episode/episode.db.util'
import { ShowDefinitionType } from '../root-type'
import {
  getShowId,
  mapDefinitionToDatabaseShow,
  mapDatabaseShowToDefinition,
  mapDatabaseShowIdsToDefinition
} from './show.resolve.util'

const showTableName = 'tv_show'

function findShowId(db: Db, show: Partial<ShowDefinitionType>): Promise<number | null> {
  return db
    .first('id')
    .from(showTableName)
    .where(getShowId(show))
    .then(row => {
      if (row) {
        return row.id || null
      }
      return null
    }) as any
}

export function assertShowExist(
  db: Db,
  show: Partial<ShowDefinitionType>
): Promise<number> {
  return findShowId(db, show).then(id => {
    if (!id) {
      throw new ShowNotExistError('Show do not exist')
    }
    return id
  })
}

export function assertShowNotExist(
  db: Db,
  show: Partial<ShowDefinitionType>
): Promise<null> {
  return findShowId(db, show).then(id => {
    if (id) {
      throw new ShowExistError('Show already exist')
    }
    return null
  })
}

export function updateShow(
  db: Db,
  id: number,
  show: Partial<ShowDefinitionType>
): Promise<number> {
  return Promise.resolve(mapDefinitionToDatabaseShow(show))
    .then(dbShow =>
      db(showTableName)
        .update(dbShow)
        .where('id', id)
    )
    .then(() => id)
}

export function addShow(db: Db, show: ShowDefinitionType): Promise<number[]> {
  if (show.id) {
    throw new BadInput('Can not set id for insert!')
  } else if (!show.tvdbId) {
    throw new BadInput('tvdbId is required!')
  }
  return assertShowNotExist(db, show)
    .then(() => mapDefinitionToDatabaseShow(show))
    .then(dbShow =>
      db.transaction(trx =>
        trx(showTableName)
          .insert(dbShow)
          .then(insertIds => insertIds[0])
          .then(showId => addNewEpisodesInDb(trx, showId, show.episodes))
      )
    )
}

export async function findShow(
  db: Db,
  showIds: { id?: number; tvdbId?: number; imdbId?: string }
): Promise<ShowDefinitionType | null> {
  return Maybe.fromNull(
    await db
      .first('*')
      .from(showTableName)
      .where(getShowId(showIds))
  )
    .map(mapDatabaseShowToDefinition)
    .orNull()
}

export function filterOutNonExistingShows(db: Db, tvdbIds: number[]) {
  return Promise.resolve(tvdbIds.map(id => id | 0).filter(id => id > 0))
    .then(ids =>
      db
        .select('id', 'tvdb_id', 'imdb_id')
        .from(showTableName)
        .whereIn('tvdb_id', ids)
    )
    .then(ids => ids.map(mapDatabaseShowIdsToDefinition))
}
