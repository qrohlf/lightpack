import env from 'src/lib/env.js'
import configureServer from 'src/lib/configureServer.js'
import User from 'src/models/User.js'
import authRoutes from 'src/routes/auth/authRoutes.js'
import packsRoutes from 'src/routes/packs/packsRoutes.js'
import packSectionsRoutes from 'src/routes/packSections/packSectionsRoutes.js'
import gearRoutes from 'src/routes/gear/gearRoutes.js'
import importRoutes from 'src/routes/import/importRoutes.js'

const PORT = env.PORT || 8000

const app = configureServer((app) => {
  // The "all the things" endpoint, just return all users and all sub-items

  app.use('/api/packs', packsRoutes)
  app.use('/api/packSections', packSectionsRoutes)
  app.use('/api/gear', gearRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/import', importRoutes)

  app.use('/error', () => {
    throw Error('foo')
  })

  // TODO - require superuser for this route
  app.use('/everything', async (req, res) => {
    const json = await User.query().withGraphFetched('packs.packSections.gear')
    res.json(json)
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
