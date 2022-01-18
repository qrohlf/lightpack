import Model from 'src/lib/Model.js'
import PackSection from 'src/models/PackSection.js'

export default class Gear extends Model {
  static get tableName() {
    return 'gear'
  }

  static get relationMappings() {
    return {
      packSection: {
        relation: Model.BelongsToOneRelation,
        modelClass: PackSection,
        join: {
          from: 'gear.packSectionId',
          to: 'packSections.id',
        },
      },
    }
  }
}
