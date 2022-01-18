import Model from 'src/lib/Model.js'
import User from 'src/models/User.js'
import PackSection from 'src/models/PackSection.js'

export default class Pack extends Model {
  static get tableName() {
    return 'packs'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'packs.userId',
          to: 'users.id',
        },
      },
      packSections: {
        relation: Model.HasManyRelation,
        modelClass: PackSection,
        join: {
          from: 'packSections.packId',
          to: 'packs.id',
        },
      },
    }
  }
}
