import APIToken from 'src/models/APIToken.js'

export default async (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && req.query.skipAuth === 'true') {
    const token = await APIToken.query()
      .where({ userId: 1 })
      .withGraphFetched('user')
      .first()
    req.user = token.user
    req.token = token
    next()
    console.log('auth override active')
    return
  }

  if (req.headers.authorization) {
    const token = await APIToken.validate(req.headers.authorization)
    if (!token) {
      res.status(401)
      res.send({ error: 'Authentication failed – invalid or expired token' })
      return
    }
    req.user = token.user
    req.token = token
    // TODO update token.lastSeen if token.lastSeen > 5 min ago
  }
  next()
}
