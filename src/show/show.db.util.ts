import { Maybe } from 'monet'
import { Db } from '../types/context.type'
import { ShowDefinitionType } from './show.type'
import {
  getShowId,
  assertValue,
  mapDefinitionToDatabaseShow,
  mapDatabaseShowToDefinition
} from './show.resolve.util'

const showTableName = 'tv_show'

export function getShowIdFromDb(
  db: Db,
  show: Partial<ShowDefinitionType>
): Promise<number> {
  const ids = getShowId(show)
  return db
    .first('id')
    .from(showTableName)
    .where(ids)
    .then(assertValue('Show do not exist: ' + JSON.stringify(ids)))
    .then(row => row.id) as any
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

export async function findShow(
  db: Db,
  showIds: { id?: number; tvdb_id?: number; imdb_id?: string }
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
