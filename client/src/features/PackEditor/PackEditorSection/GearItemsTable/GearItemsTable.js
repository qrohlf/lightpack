import React from 'react'
import styles from './GearItemsTable.module.css'

export const GearItemsTable = ({ gear }) => {
  return (
    <div className={styles.GearItemsTable}>
      <GearHeader />
      {gear.map((g) => (
        <GearRow gear={g} key={g.id} />
      ))}
    </div>
  )
}

const GearHeader = () => (
  <div className={styles.GearHeader}>
    <div>Item</div>
    <div>{/*description*/}</div>
    <div className={styles.weight}>Weight</div>
    <div className={styles.qty}>Qty</div>
  </div>
)

const GearRow = ({ gear }) => (
  <div className={styles.GearRow}>
    <div>{gear.name}</div>
    <div className={styles.description}>{gear.description}</div>
    <div className={styles.weight}>
      {gear.grams.toLocaleString('en-US', { maximumFractionDigits: 1 })} g
    </div>
    <div className={styles.qty}>1</div>
  </div>
)
