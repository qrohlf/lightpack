import { Model as ObjectionModel } from 'objection'
import day from 'src/lib/day.js'
import knex from 'src/lib/knex.js'

export default class Model extends ObjectionModel {
  // keep timestamps updated
  $beforeUpdate() {
    this.updatedAt = day.utc().toISOString()
  }
}

Model.knex(knex)
