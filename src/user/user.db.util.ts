import { Db } from '../types/context.type'
import { User } from '../root-type'

const userTableName = 'users'

export async function findApiUser(
  db: Db,
  username: string,
  apikey: string
): Promise<User | null> {
  return db
    .first('id')
    .from(userTableName)
    .where({ username, apikey })
    .then(row => row || null)
}
