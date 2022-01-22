export const up = (knex) =>
  knex.schema.createTable('packs', function (t) {
    t.increments()
    // we can go up to 16 chars for the shareId, but we'll start at 8
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

    t.enu('weightUnitsTotal', ['g', 'kg', 'oz', 'lbs'])
      .notNull()
      .defaultTo('lbs')

    t.enu('weightUnitsSection', ['g', 'kg', 'oz', 'lbs'])
      .notNull()
      .defaultTo('lbs')

    t.enu('weightUnitsGear', ['g', 'kg', 'oz', 'lbs']).notNull().defaultTo('oz')
  })

export const down = (knex) => knex.schema.dropTable('packs')
