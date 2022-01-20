import express from 'express'
import _log from 'src/lib/log.js'
import fetch from 'node-fetch'
import parseLighterpack from 'src/lib/parseLighterpack.js'
import Pack from 'src/models/Pack.js'

const log = _log('IMPORT')
const app = express.Router()

app.post('/lighterpack', async (req, res) => {
  const lighterpackId = req.body.id
  const url = `https://lighterpack.com/r/${lighterpackId}`
  log(`fetching ${url}`)
  const lpResponse = await fetch(url).then((r) => r.text())
  const parsed = parseLighterpack(lpResponse)

  const pack = await Pack.query().insertGraph({
    userId: 1,
    ...parsed,
  })
  res.json({ pack })
})

export default app
