// import React from 'react'

export const toOz = (g) => g * 0.03527396195
export const toLb = (g) => g * 0.0022046226

// TODO FIXME
export const useUnits = (type) => {
  switch (type) {
    case 'total':
      return {
        id: 'lb',
        precision: 2,
      }
    case 'section':
      return {
        id: 'lb',
        precision: 2,
      }
    case 'gear':
      return {
        id: 'oz',
        precision: 2,
      }
    default:
      throw Error(`unknown weight type: ${type}`)
  }
}

export const Weight = ({ g, type }) => {
  const units = useUnits(type)

  switch (units.id) {
    case 'g':
      return (
        g.toLocaleString('en-US', { maximumFractionDigits: units.precision }) +
        ' g'
      )
    case 'oz':
      return (
        toOz(g).toLocaleString('en-US', {
          maximumFractionDigits: units.precision,
        }) + ' oz'
      )
    case 'lb':
      return (
        toLb(g).toLocaleString('en-US', {
          maximumFractionDigits: units.precision,
        }) + ' lb'
      )
    default:
      throw Error(`unknown units: ${units} (type=${type}`)
  }
}
