import express from 'express'
import Pack from 'src/models/Pack.js'
const app = express.Router()

const findPack = async (req, res, next) => {
  const { packId } = req.params
  const pack = await Pack.query().findById(packId)
  if (!pack) {
    res.error.notFound()
    return
  }
  req.pack = pack
  next()
}

// the following two endpoints should probably be moved under the /admin
// namespace!
app.get('/:packId', findPack, async (req, res) => {
  const pack = await req.pack.$query().withGraphFetched('packSections.gear')
  res.json({ pack })
})

export default app
