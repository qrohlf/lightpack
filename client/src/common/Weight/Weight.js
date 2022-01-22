// import React from 'react'

const toOz = (g) => g * 0.03527396195
const toLb = (g) => g * 0.0022046226

// TODO FIXME
const useWeightUnits = (type) => {
  switch (type) {
    case 'total':
      return 'lb'
    case 'section':
      return 'lb'
    case 'gear':
      return 'oz'
    default:
      throw Error(`unknown weight type: ${type}`)
  }
}

export const Weight = ({ g, type }) => {
  const units = useWeightUnits(type)

  switch (units) {
    case 'g':
      return g.toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' g'
    case 'oz':
      return (
        toOz(g).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' oz'
      )
    case 'lb':
      return (
        toLb(g).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' lb'
      )
    default:
      throw Error(`unknown units: ${units} (type=${type}`)
  }
}
