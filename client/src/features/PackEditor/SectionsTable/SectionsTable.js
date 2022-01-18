import React from 'react'
import styles from './SectionsTable.module.css'
import cx from 'classnames'
import { getSectionWeight, getTotalWeight } from 'lib/packUtils'

export const SectionsTable = ({ pack, colorForIndex }) => {
  return (
    <div className={styles.SectionsTable}>
      <div className={styles.SectionsTableHeader}>
        <div className={styles.sectionName}>Category</div>
        <div className={styles.weight}>Weight</div>
      </div>
      {pack.packSections.map((s, i) => (
        <SectionsTableRow section={s} color={colorForIndex(i)} />
      ))}
      <div className={cx(styles.SectionsTableFooter, styles.first)}>
        <div className={styles.totalName}>Total</div>
        <div className={styles.weight}>
          {getTotalWeight(pack).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}{' '}
          g
        </div>
      </div>
      <div className={styles.SectionsTableFooter}>
        <div className={styles.totalName}>Consumable</div>
        <div className={styles.weight}>0 g</div>
      </div>
      <div className={styles.SectionsTableFooter}>
        <div className={styles.totalName}>Worn weight</div>
        <div className={styles.weight}>0 g</div>
      </div>
      <div className={styles.SectionsTableFooter}>
        <div className={styles.totalName}>Base weight</div>
        <div className={styles.weight}>0 g</div>
      </div>
    </div>
  )
}

const SectionsTableRow = ({ section, color }) => (
  <div className={styles.SectionsTableRow}>
    <div className={styles.sectionName}>
      <div className={styles.dot} style={{ background: color }} />
      {section.name}
    </div>
    <div className={styles.weight}>
      {getSectionWeight(section).toLocaleString('en-US', {
        maximumFractionDigits: 1,
      })}{' '}
      g
    </div>
  </div>
)
