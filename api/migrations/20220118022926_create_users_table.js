export const up = (knex) =>
  knex.schema.createTable('users', function (t) {
    t.increments()

    t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())

    t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    t.string('email', 1024).unique().notNullable()
    t.string('passwordHash', 1024).notNullable()
  })

export const down = (knex) => knex.schema.dropTable('users')
