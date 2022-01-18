import env from 'src/lib/env.js'
import configureServer from 'src/lib/configureServer.js'
import User from 'src/models/User.js'
import packsRoutes from 'src/routes/packsRoutes.js'

const PORT = env.PORT || 8000

// do the server configuration, injecting app routes after the boilerplate
// stuff, but before the error fall-though code
const app = configureServer((app) => {
  // The "all the things" endpoint, just return all users and all sub-items

  app.use('/api/packs', packsRoutes)

  app.use('/api', async (req, res) => {
    const json = await User.query().withGraphFetched('packs.packSections.gear')
    res.json(json)
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
