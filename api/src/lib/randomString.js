import crypto from 'crypto'
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export default (length) => {
  var bytes = crypto.randomBytes(length)

  return [...bytes].map((b) => charset[b % charset.length]).join('')
}
