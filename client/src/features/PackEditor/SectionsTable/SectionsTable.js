import React from 'react'
import styles from './SectionsTable.module.css'
import cx from 'classnames'
import { getSectionWeight, getTotalWeight, filters } from 'lib/packUtils'
import { Weight } from 'common/Weight'

export const SectionsTable = ({ pack, colorForIndex }) => {
  const totalWeight = getTotalWeight(pack)
  const wornWeight = getTotalWeight(pack, filters.wornWeight)
  const consumableWeight = getTotalWeight(pack, filters.consumableWeight)
  const baseWeight = getTotalWeight(pack, filters.baseWeight)

  return (
    <div className={styles.SectionsTable}>
      <div className={styles.SectionsTableHeader}>
        <div className={styles.sectionName}>Category</div>
        <div className={styles.weight}>Weight</div>
      </div>
      {pack.packSections.map((s, i) => (
        <SectionsTableRow key={s.id} section={s} color={colorForIndex(i)} />
      ))}
      <div className={cx(styles.SectionsTableFooter, styles.first)}>
        <div className={styles.totalName}>Total</div>
        <div className={styles.weight}>
          <Weight g={totalWeight} type="total" />
        </div>
      </div>
      <div className={styles.SectionsTableFooter}>
        <div className={styles.totalName}>Consumable</div>
        <div className={styles.weight}>
          <Weight g={consumableWeight} type="total" />
        </div>
      </div>
      <div className={styles.SectionsTableFooter}>
        <div className={styles.totalName}>Worn weight</div>
        <div className={styles.weight}>
          <Weight g={wornWeight} type="total" />
        </div>
      </div>
      <div className={styles.SectionsTableFooter}>
        <div className={styles.totalName}>Base weight</div>
        <div className={styles.weight}>
          <Weight g={baseWeight} type="total" />
        </div>
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
      <Weight g={getSectionWeight(section)} type="section" />
    </div>
  </div>
)
