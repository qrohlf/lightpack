import Model from 'src/lib/Model.js'
import PackSection from 'src/models/PackSection.js'
import serializer from 'src/lib/serializer.js'

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

  $formatJson() {
    const serialize = serializer(
      serializer.include(
        'consumable',
        'createdAt',
        'description',
        'emoji',
        'grams',
        'id',
        'link',
        'name',
        'packId',
        'packSectionId',
        'qty',
        'updatedAt',
        'worn',
      ),
    )

    const output = serialize(this)
    if (!output.packId) {
      throw Error('gear missing packId')
    }
    return output
  }
}
