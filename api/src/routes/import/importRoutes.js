import express from 'express'
import _log from 'src/lib/log.js'
import fetch from 'node-fetch'
import parseLighterpack from 'src/lib/parseLighterpack.js'
import Pack from 'src/models/Pack.js'
import { LP_IMPORT_USER } from 'src/lib/constants.js'

const log = _log('IMPORT')
const app = express.Router()

/*
How do we want to handle unauthenticated users who import a LP?

I think we want to pretty much do the same thing for both cases:

1. Import the LP to our "lp temp user"
2. Show a read-only preview
3. Prompt the user to "save this pack to your account"
4. On save, move the preview to the user's account by updating the userId

*/
app.post('/lighterpack', async (req, res) => {
  const lighterpackId = req.body.lighterpackId
  const url = `https://lighterpack.com/r/${lighterpackId}`
  log.info(`fetching ${url}`)
  const lpResponse = await fetch(url).then((r) => r.text())
  log.info(lpResponse)
  const parsed = parseLighterpack(lpResponse)

  const pack = await Pack.query().insertGraph({
    userId: 1, // TODO use LP_IMPORT_USER,
    ...parsed,
  })

  // TODO - respond with shareId
  res.json({ packId: pack.id })
})

export default app
