export const up = (knex) =>
  knex.schema.createTable('packs', function (t) {
    t.increments()
    t.string('shareId', 16).notNullable().unique().index()

    t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())

    t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    t.string('name', 1024).notNullable().defaultTo('')
    t.text('description').notNullable().defaultTo('')
    t.integer('userId')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
  })

export const down = (knex) => knex.schema.dropTable('packs')
