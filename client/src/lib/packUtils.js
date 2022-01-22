export const getSectionWeight = (section, filter) => {
  const gear = filter ? section.gear.filter(filter) : section.gear
  return gear.reduce((sum, item) => sum + item.grams * item.qty, 0)
}

export const getSectionQty = (section) =>
  section.gear.reduce((qty, item) => qty + item.qty, 0)

export const getTotalWeight = (pack, filter) =>
  pack.packSections.reduce(
    (sum, section) => sum + getSectionWeight(section, filter),
    0,
  )

export const filters = {
  wornWeight: (gear) => gear.worn,
  consumableWeight: (gear) => gear.consumable,
  baseWeight: (gear) => !(gear.consumable || gear.worn),
}
