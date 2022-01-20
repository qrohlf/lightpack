import express from 'express'
import _log from 'src/lib/log.js'

const log = _log('__name|upperSnakeCase__')
const app = express.Router()

app.get('/:__name__Id', async (req, res) => {
  res.json({ foo: 'bar' })
})

export default app
