import env from 'src/lib/env.js'
import configureServer from 'src/lib/configureServer.js'
import User from 'src/models/User.js'
import Pack from 'src/models/Pack.js'
import packsRoutes from 'src/routes/packsRoutes.js'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import repl from 'repl'

const PORT = env.PORT || 8000

const parseLP = (html) => {
  const dom = new JSDOM(html)
  const document = dom.window.document

  const name = document.querySelector('.lpListName').textContent
  const descriptionNode = document.querySelector('#lpListDescription')

  // TODO - stop using innerHTML here, use textContent instead and properly
  // replace the <br> elements
  const description = [...descriptionNode.children]
    .map((p) => p.innerHTML.replace('<br>', '\n'))
    .join('\n\n')

  const sectionNodes = [...document.querySelectorAll('.lpCategory')]
  const packSections = sectionNodes.map((node) => {
    const name = node.querySelector('.lpCategoryName').textContent
    const gearNodes = [...node.querySelectorAll('.lpItem')]
    const gear = gearNodes.map((gearNode) => {
      const name = gearNode.querySelector('.lpName').textContent.trim()
      const description = gearNode
        .querySelector('.lpDescription')
        .textContent.trim()
      const weightMg = gearNode.querySelector('.lpMG')?.value
      const grams = weightMg / 1000 || 0
      return { name, description, grams }
    })
    return { name, gear }
  })

  return { name, description, packSections }
}

// do the server configuration, injecting app routes after the boilerplate
// stuff, but before the error fall-though code
const app = configureServer((app) => {
  // The "all the things" endpoint, just return all users and all sub-items

  app.use('/api/packs', packsRoutes)

  app.use('/api', async (req, res) => {
    const json = await User.query().withGraphFetched('packs.packSections.gear')
    res.json(json)
  })

  app.get('/r/:lighterpackId', async (req, res) => {
    const { lighterpackId } = req.params
    const url = `https://lighterpack.com/r/${lighterpackId}`
    console.log(`fetching ${url}`)
    const lpResponse = await fetch(url).then((r) => r.text())
    const parsed = parseLP(lpResponse)
    const pack = await Pack.query().insertGraph({
      userId: 1,
      ...parsed,
    })
    res.json({ pack })
  })
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
