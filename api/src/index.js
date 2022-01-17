import env from 'src/lib/env.js'
import configureServer from 'src/lib/configureServer.js'

const PORT = env.PORT || 5000

// do the server configuration, injecting app routes after the boilerplate
// stuff, but before the error fall-though code
const app = configureServer((app) => {
  app.use('/', async (req, res) => {
    res.json({ hello: 'world' })
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
