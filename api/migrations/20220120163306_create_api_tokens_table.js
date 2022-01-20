export const up = (knex) =>
  knex.schema.createTable('apiTokens', function (t) {
    t.increments()

    t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())

    t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    t.timestamp('lastSeen').notNullable().defaultTo(knex.fn.now())

    t.integer('userId')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    t.string('tokenHash', 1024).notNullable()
  })

export const down = (knex) => knex.schema.dropTable('apiTokens')
