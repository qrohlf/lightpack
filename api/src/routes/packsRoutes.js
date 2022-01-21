import express from 'express'
import Pack from 'src/models/Pack.js'
import requireAuth from 'src/lib/middleware/requireAuth.js'
const app = express.Router()

const findPack = async (req, res, next) => {
  const { packId } = req.params
  const pack = await req.user.$relatedQuery('packs').findById(packId)
  if (!pack) {
    res.error.notFound()
    return
  }
  req.pack = pack
  next()
}

const findPackByShareId = async (req, res, next) => {
  const { shareId } = req.params
  const pack = await Pack.query().findOne({ shareId })
  if (!pack) {
    res.error.notFound()
    return
  }
  req.pack = pack
  next()
}

app.get('/:packId', requireAuth, findPack, async (req, res) => {
  res.json({
    pack: await req.pack.$query().withGraphFetched('packSections.gear'),
  })
})

app.get('/public/:shareId', findPackByShareId, async (req, res) => {
  res.json({
    pack: await req.pack.$query().withGraphFetched('packSections.gear'),
  })
})

export default app
