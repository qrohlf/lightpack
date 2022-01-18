export const getSectionWeight = (section) =>
  section.gear.reduce((sum, item) => sum + item.grams, 0)

export const getTotalWeight = (pack) =>
  pack.packSections.reduce((sum, section) => sum + getSectionWeight(section), 0)
