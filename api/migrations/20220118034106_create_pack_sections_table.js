export const up = (knex) =>
  knex.schema.createTable('packSections', function (t) {
    t.increments()

    t.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())

    t.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())

    t.integer('packId')
      .notNullable()
      .unsigned()
      .index()
      .references('id')
      .inTable('packs')
      .onDelete('CASCADE')

    t.string('rank', 255).notNullable().defaultTo('')

    // rank must be unique within packs
    t.unique(['rank', 'packId'])

    t.string('name', 1024).notNullable().defaultTo('')
    t.text('description').notNullable().defaultTo('')
  })

export const down = (knex) => knex.schema.dropTable('packSections')
