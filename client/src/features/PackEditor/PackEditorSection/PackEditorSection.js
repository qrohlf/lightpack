import React from 'react'
import styles from './PackEditorSection.module.css'
import { GearItemsTable } from './GearItemsTable'

export const PackEditorSection = ({ section, color }) => {
  return (
    <div className={styles.PackEditorSection}>
      <div className={styles.colorDotContainer}>
        <div className={styles.colorDot} style={{ background: color }} />
      </div>
      <div className={styles.mainContent}>
        <h2>{section.name}</h2>
        <GearItemsTable section={section} />
      </div>
    </div>
  )
}
