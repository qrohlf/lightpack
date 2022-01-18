import React from 'react'
import styles from './WaffleChart.module.css'
import { getSectionWeight } from 'lib/packUtils'

// each cell corresponds to 30g
const CELL_WEIGHT = 30
export const WaffleChart = ({ pack, colorForIndex }) => {
  const cells = []
  pack.packSections.forEach((section, index) => {
    const cellCount = Math.round(getSectionWeight(section) / CELL_WEIGHT)
    const sectionColor = colorForIndex(index)
    for (let i = 0; i < cellCount; i++) {
      cells.push(<div style={{ background: sectionColor }} />)
    }
  })

  return <div className={styles.WaffleChart}>{cells}</div>
}
