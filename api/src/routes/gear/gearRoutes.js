import express from 'express'
import _log from 'src/lib/log.js'
import requireAuth from 'src/lib/middleware/requireAuth.js'
import Gear from 'src/models/Gear.js'
const log = _log('GEAR')
const app = express.Router()

// we're crashing hard on postgres errors - need to figure out why error handling isn't picking this up!
// presumably we need to call next?
const findGear = async (req, res, next) => {
  const { gearId } = req.params
  const gear = await Gear.query()
    .select('gear.*')
    .select('packSection:pack.id as packId')
    .joinRelated('packSection.pack.user')
    .where({ 'packSection:pack:user.id': req.user.id })
    .findById(gearId)

  if (!gear) {
    res.error.notFound()
    return
  }
  req.gear = gear
  next()
}

app.patch('/:gearId', requireAuth, findGear, async (req, res) => {
  const { name, description, grams, consumable, worn, qty } = req.body
  log.info(req.body)
  // TODO: param validation
  const gear = await req.gear
    .$query()
    .patch({ name, description, grams, consumable, worn, qty })
    .returning('*')
  gear.packId = req.gear.packId
  res.json({ gear })
})

export default app
