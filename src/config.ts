import { Config } from 'knex'

export const config = {
  db: {
    client: 'mysql',
    connection: {
      host: process.env.EH_DB_HOST || '127.0.0.1',
      user: process.env.EH_DB_USERNAME || 'user',
      password: process.env.EH_DB_PASSWORD || '123',
      database: process.env.EH_DB_DATABASE || 'episodehunter',
      port: process.env.EH_DB_PORT || 3306
    },
    debug: false
  } as Config
}