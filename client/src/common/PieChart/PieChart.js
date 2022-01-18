import React from 'react'
import styles from './PieChart.module.css'
import { ResponsivePie } from '@nivo/pie'
import { getSectionWeight } from 'lib/packUtils'

export const PieChart = ({ pack, colorForIndex }) => {
  const data = pack.packSections.map((section, i) => ({
    id: section.id,
    label: section.name,
    value: getSectionWeight(section),
    color: colorForIndex(i),
  }))
  return (
    <div className={styles.PieChart}>
      <ResponsivePie
        data={data}
        colors={{ datum: 'data.color' }}
        margin={{ top: 3, right: 3, bottom: 3, left: 3 }}
        innerRadius={0.5}
        padAngle={1.8}
        cornerRadius={3}
        activeOuterRadiusOffset={3}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        tooltip={() => null}
      />
    </div>
  )
}
