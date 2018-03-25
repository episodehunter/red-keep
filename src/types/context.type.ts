import * as Knex from 'knex'
import { Logger } from '../logger'

export type Context = {
  db: Knex
  logger: Logger
}

export type Db = Knex
export type DbTransaction = Knex.Transaction
