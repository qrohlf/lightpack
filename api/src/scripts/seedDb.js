import knex from 'src/lib/knex.js'
import Pack from 'src/models/Pack.js'
import User from 'src/models/User.js'
import PackSection from 'src/models/PackSection.js'
import Gear from 'src/models/Gear.js'

const seedDb = async () => {
  try {
    const user = await User.query().insert({
      email: 'qrohlf@gmail.com',
      password: 'password',
    })

    const pack = await Pack.query().insert({
      name: 'Spring Fastpacking',
      userId: user.id,
    })

    const sectionPack = await PackSection.query().insert({
      name: 'Backpack',
      packId: pack.id,
    })

    await Gear.query().insert({
      name: `Pa'lante Joey`,
      packSectionId: sectionPack.id,
    })

    const sectionShelter = await PackSection.query().insert({
      name: 'Shelter',
      packId: pack.id,
    })

    await Gear.query().insert({
      name: `Locus Gear Khufu`,
      packSectionId: sectionShelter.id,
    })
  } finally {
    knex.destroy()
  }
}

seedDb()
