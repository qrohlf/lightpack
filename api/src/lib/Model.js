import { Model as ObjectionModel } from 'objection'
import day from 'lib/day.js'

class Model extends ObjectionModel {
  // keep timestamps updated
  $beforeUpdate() {
    if (this.updatedAt) {
      this.updatedAt = day.utc().toISOString()
    }
  }
}

module.exports = { Model }
