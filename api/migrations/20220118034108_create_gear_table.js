export const up = (knex) =>
  knex.schema.createTable('gear', function (t) {
    t.increments()

    t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())

    t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    t.integer('packSectionId')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('packSections')
      .onDelete('CASCADE')

    t.string('name', 1024).notNullable().defaultTo('')
    t.string('emoji', 1).notNullable().defaultTo('')
    t.text('description').notNullable().defaultTo('')

    t.float('grams').notNullable().defaultTo(0)
  })

export const down = (knex) => knex.schema.dropTable('gear')
