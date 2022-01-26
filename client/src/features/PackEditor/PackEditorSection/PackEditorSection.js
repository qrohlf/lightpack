import React from 'react'
import styles from './PackEditorSection.module.css'
import { GearItemsTable } from './GearItemsTable'
import cx from 'classnames'

export const PackEditorSection = React.forwardRef(
  ({ packSection, color, style, isDragging, handleProps }, ref) => {
    return (
      <div
        ref={ref}
        className={cx(
          styles.PackEditorSection,
          isDragging && styles.isDragging,
        )}
        style={style}
      >
        <div className={styles.colorDotContainer}>
          <div
            {...handleProps}
            className={styles.colorDot}
            style={{ background: color }}
          />
        </div>
        <div className={styles.mainContent}>
          <h2>{packSection.name}</h2>
          <GearItemsTable section={packSection} />
        </div>
      </div>
    )
  },
)
