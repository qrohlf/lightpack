import React from 'react'
import styles from './GearItemsTable.module.css'
import { GearHeader, GearRow, TotalRow } from './GearRow'
import _ from 'lodash'

export const GearItemsTable = ({ section }) => {
  const gear = _.sortBy(section.gear, (g) => g.rank)

  return (
    <div className={styles.GearItemsTable}>
      <GearHeader />
      {gear.map((g) => (
        <GearRow gear={g} key={g.id} />
      ))}
      <TotalRow section={section} />
    </div>
  )
}
