import express from 'express'
import User from 'src/models/User.js'
import APIToken from 'src/models/APIToken.js'
import _log from 'src/lib/log.js'
import requireAuth from 'src/lib/middleware/requireAuth.js'

const log = _log('AUTH')
const app = express.Router()

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.query().findOne({ email })

  if (user && user.verifyPassword(password)) {
    const token = await APIToken.query().insert({ userId: user.id })
    log(
      `user ${user.id}/${user.email} authenticated succesfully,`,
      'issued token id: ' + token.id,
    )
    res.json({ user, token })
  } else {
    res.error.authFailed('Invalid email or password')
  }
})

app.post('/logout', requireAuth, async (req, res) => {
  log('deleting api token', req.token.id)
  const deleteCount = await APIToken.query().deleteById(req.token.id)
  // todo - `success` bool in HTTP responses is a code smell,
  // success should be exclusively communicated via a 2xx response code
  res.send({ deleteCount })
})

export default app
