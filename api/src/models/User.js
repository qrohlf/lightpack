import bcrypt from 'bcryptjs'
import { transaction } from 'objection'
import Model from 'src/lib/Model.js'
import Pack from 'src/models/Pack.js'
import APIToken from 'src/models/APIToken.js'
import serializer from 'src/lib/serializer.js'

export default class User extends Model {
  static get tableName() {
    return 'users'
  }

  static get relationMappings() {
    return {
      packs: {
        relation: Model.HasManyRelation,
        modelClass: Pack,
        join: {
          from: 'packs.userId',
          to: 'users.id',
        },
      },
      apiTokens: {
        relation: Model.HasManyRelation,
        modelClass: APIToken,
        join: {
          from: 'apiTokens.userId',
          to: 'users.id',
        },
      },
    }
  }

  set password(password) {
    this.passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }

  verifyPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash)
  }

  changePassword(newPassword) {
    // TODO - pass tx into the appropriate spot here.
    // eslint-disable-next-line
    return transaction(knex, async (tx) => {
      await User.query().patchAndFetchById(this.id, { password: newPassword })
      const expired = await APIToken.query().where({ userId: this.id }).delete()
      console.log(`expired ${expired} tokens as part of a password change`)
    })
  }

  $formatJson() {
    const serialize = serializer(serializer.include('id', 'email', 'packs'))

    return serialize(this)
  }
}
