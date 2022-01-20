import Model from 'src/lib/Model.js'
import User from 'src/models/User.js'
import env from 'src/lib/env.js'
import _log from 'src/lib/log.js'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
const log = _log('API_TOKEN')
import serializer from 'src/lib/serializer.js'

const TOKEN_SECRET = env.API_TOKEN_SECRET

if (!TOKEN_SECRET) {
  log.error('No API_TOKEN_SECRET provided, exiting')
  process.exit(1)
}

const sha256 = (string) =>
  crypto.createHmac('sha256', TOKEN_SECRET).update(string).digest('hex')

export default class APIToken extends Model {
  static get tableName() {
    return 'apiTokens'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'apiTokens.userId',
          to: 'users.id',
        },
      },
    }
  }

  static async validate(token) {
    // 1. sha256 the incoming token
    const tokenHash = sha256(token)
    // 2. lookup the token hash in the cache
    return APIToken.query().withGraphFetched('user').findOne({ tokenHash })
    // 3. on cache miss, lookup the token hash in the database
    //
    // note: the cache part will probably be ommitted in the first version of this
  }

  $beforeInsert(context) {
    super.$beforeInsert(context)
    this.token = uuidv4()
    this.tokenHash = sha256(this.token)
  }

  $formatDatabaseJson(props) {
    const json = super.$formatDatabaseJson(props)
    delete json.token
    return json
  }

  $formatJson() {
    const serialize = serializer(serializer.include('token', 'userId'))

    return serialize(this)
  }
}
