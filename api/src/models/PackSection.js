import Model from 'src/lib/Model.js'
import Gear from 'src/models/Gear.js'

export default class PackSection extends Model {
  static get tableName() {
    return 'packSections'
  }

  static get relationMappings() {
    return {
      gear: {
        relation: Model.HasManyRelation,
        modelClass: Gear,
        join: {
          from: 'gear.packSectionId',
          to: 'packSections.id',
        },
      },
    }
  }
}
