import knex from 'src/lib/knex.js'
import Pack from 'src/models/Pack.js'
import User from 'src/models/User.js'

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

    await Pack.query().insertGraph({
      name: 'Spring Fastpacking',
      userId: user.id,
      packSections: [
        {
          name: 'Pack',
          gear: [{ name: "Pa'lante Joey", grams: 455 }],
        },
        {
          name: 'Shelter',
          gear: [
            {
              name: 'Tent',
              description: 'Locus Khufu DCF (incl stuff sack)',
              grams: 345.8,
            },
            {
              name: 'Pole Extender',
              description: 'Needed for use with fixed-length trekking poles',
              grams: 25.5,
            },
            {
              name: 'Stakes',
              description: '4x Mini Hog, 2x Ti Hook',
              grams: 53.8,
            },
            {
              name: 'Trekking Pole',
              description: 'BD Alpine Carbon Z, (single pole, 120cm)',
            },
          ],
        },
        {
          name: 'Sleep',
          gear: [
            {
              name: 'Sleeping Bag',
              description: 'Marmot Phase 20',
              grams: 630.3,
            },
            {
              name: 'Sleeping Pad',
              description: 'xlite reg wide with stuff sack',
              grams: 460.68,
            },
            {
              name: 'Pillowcase',
              description: 'thermarest discontinued model',
              grams: 28.3,
            },
          ],
        },
      ],
    })
  } finally {
    knex.destroy()
  }
}

seedDb()
