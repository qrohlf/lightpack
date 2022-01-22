import randomString from 'src/lib/randomString.js'
import Model from 'src/lib/Model.js'
import User from 'src/models/User.js'
import PackSection from 'src/models/PackSection.js'
import _log from 'src/lib/log.js'
const log = _log('PACK')

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

  async $beforeInsert() {
    if (!this.shareId) {
      // generate a unique shareId
      this.shareId = randomString(8)
      const hasColission = async () =>
        (await Pack.query().where({ shareId: this.shareId }).count().first())
          .count > 0
      while (await hasColission()) {
        log.warn(`shareId colission on ${this.shareId}`)
        this.shareId = randomString(10)
      }
    }
  }
}
