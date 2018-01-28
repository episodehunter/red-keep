import { Config } from 'knex'

export const config = {
  db: {
    client: 'mysql',
    connection: {
      host: process.env.EH_DB_HOST,
      user: process.env.EH_DB_USERNAME,
      password: process.env.EH_DB_PASSWORD,
      database: process.env.EH_DB_DATABASE,
      port: process.env.EH_DB_PORT
    },
    debug: false
  } as Config
}
