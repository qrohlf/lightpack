import express from 'express'
import Pack from 'src/models/Pack.js'
import requireAuth from 'src/lib/middleware/requireAuth.js'
import objection from 'objection'
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

app.get('/', requireAuth, async (req, res) => {
  res.json({
    packs: await req.user.$relatedQuery('packs'),
  })
})

app.get('/:packId', requireAuth, findPack, async (req, res) => {
  const pack = await req.pack.$query().withGraphJoined('packSections.gear')

  // inject packId
  for (const packSection of pack.packSections) {
    for (const gear of packSection.gear) {
      gear.packId = pack.id
    }
  }

  res.json({
    pack,
  })
})

app.get('/public/:shareId', findPackByShareId, async (req, res) => {
  const pack = await req.pack.$query().withGraphFetched('packSections.gear')

  // inject packId
  for (const packSection of pack.packSections) {
    for (const gear of packSection.gear) {
      gear.packId = pack.id
    }
  }
  res.json({
    pack,
  })
})

export default app
