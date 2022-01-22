import fetch from 'node-fetch'
import knex from 'src/lib/knex.js'
import Pack from 'src/models/Pack.js'
import User from 'src/models/User.js'
import parseLighterpack from 'src/lib/parseLighterpack.js'

const seedDb = async () => {
  try {
    const user = await User.query().insert({
      email: 'qrohlf@gmail.com',
      password: 'password',
      role: 'superuser',
    })

    // seed LP_IMPORT_USER
    await User.query().insert({
      email: 'lpimport@lightpack.club',
      password: '2ZeWRp6_WbL2ccuEMk',
    })

    const importLP = async (url) => {
      const lpResponse = await fetch(url).then((r) => r.text())
      const parsed = parseLighterpack(lpResponse)
      await Pack.query().insertGraph({
        userId: user.id,
        ...parsed,
      })
      console.log(`imported ${url}`)
    }

    try {
      await importLP('https://lighterpack.com/r/mvrg3d')
      await importLP('https://lighterpack.com/r/snthnm')
      await importLP('https://lighterpack.com/r/e87qn6')
    } catch (e) {
      console.error(e)
    }
  } finally {
    knex.destroy()
  }
}

seedDb()
