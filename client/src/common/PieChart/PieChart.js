import React from 'react'
import styles from './PieChart.module.css'
import { ResponsivePie } from '@nivo/pie'
import { getSectionWeight } from 'lib/packUtils'
import { TooltipWrapper } from '@nivo/tooltip'

const Tooltip = ({ datum: { label, value, color } }) => (
  <TooltipWrapper anchor="right" position={[0, 0]}>
    <div className={styles.Tooltip}>
      <div className={styles.label}>
        <div className={styles.dot} style={{ background: color }} />
        {label}
      </div>
      <div className={styles.value}>
        {value.toLocaleString('en-US', { maximumFractionDigits: 1 })} g
      </div>
    </div>
  </TooltipWrapper>
)

export const PieChart = ({ pack, colorForIndex }) => {
  const data = pack.packSections
    .map((section, i) => ({
      id: section.id,
      label: section.name,
      value: getSectionWeight(section),
      color: colorForIndex(i),
    }))
    .filter(({ value }) => value > 0)
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
        tooltip={Tooltip}
      />
    </div>
  )
}
