import env from 'src/lib/env.js'

export default {
  client: 'postgresql',
  connection: env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    stub: 'src/lib/migrationTemplate.js',
  },
}
