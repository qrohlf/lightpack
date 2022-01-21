import env from 'src/lib/env.js'
import configureServer from 'src/lib/configureServer.js'
import User from 'src/models/User.js'
import packsRoutes from 'src/routes/packsRoutes.js'
import authRoutes from 'src/routes/auth/authRoutes.js'
import importRoutes from 'src/routes/import/importRoutes.js'

const PORT = env.PORT || 8000

const app = configureServer((app) => {
  // The "all the things" endpoint, just return all users and all sub-items

  app.use('/api/packs', packsRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/import', importRoutes)

  // TODO - require superuser for this route
  app.use('/everything', async (req, res) => {
    const json = await User.query().withGraphFetched('packs.packSections.gear')
    res.json(json)
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
