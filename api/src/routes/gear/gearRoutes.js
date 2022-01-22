import express from 'express'
import _log from 'src/lib/log.js'
import requireAuth from 'src/lib/middleware/requireAuth.js'
import Gear from 'src/models/Gear.js'
// const log = _log('GEAR')
const app = express.Router()

const findGear = async (req, res, next) => {
  const { gearId } = req.params
  const gear = await Gear.query()
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
  const { name, description } = req.body
  const gear = await req.gear
    .$query()
    .patch({ name, description })
    .returning('*')
  res.json(gear)
})

export default app
