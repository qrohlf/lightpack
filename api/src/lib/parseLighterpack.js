import { JSDOM } from 'jsdom'

export default (lighterpackHtml) => {
  const dom = new JSDOM(lighterpackHtml)
  const document = dom.window.document

  const name = document.querySelector('.lpListName').textContent
  const descriptionNode = document.querySelector('#lpListDescription')

  // TODO - stop using innerHTML here, use textContent instead and properly
  // replace the <br> elements
  const description = [...(descriptionNode?.children || [])]
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
      const worn = !!gearNode.querySelector('.lpWorn.lpActive')
      const consumable = !!gearNode.querySelector('.lpConsumable.lpActive')
      const qty = parseInt(gearNode.querySelector('.lpQtyCell').textContent, 10)
      return { name, description, grams, worn, consumable, qty }
    })
    return { name, gear }
  })

  return { name, description, packSections }
}
