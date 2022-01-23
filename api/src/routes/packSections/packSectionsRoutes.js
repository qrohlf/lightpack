import express from 'express'
import _log from 'src/lib/log.js'
import requireAuth from 'src/lib/middleware/requireAuth.js'
import PackSection from 'src/models/PackSection.js'
const log = _log('PACKSECTIONS')
const app = express.Router()

const findPackSection = async (req, res, next) => {
  const { packSectionId } = req.params
  const packSection = await PackSection.query()
    .select('packSections.*')
    .joinRelated('pack.user')
    .where({ 'pack:user.id': req.user.id })
    .findById(packSectionId)

  if (!packSection) {
    res.error.notFound()
    return
  }
  req.packSection = packSection
  next()
}

app.patch('/:packSectionId', requireAuth, findPackSection, async (req, res) => {
  const { name, rank } = req.body
  log.info(req.body)
  // TODO: param validation
  const packSection = await req.packSection
    .$query()
    .patch({ name, rank })
    .returning('*')
  res.json({ packSection })
})

export default app
