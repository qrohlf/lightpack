import React, { useState, useEffect } from 'react'
import styles from './GearItemsTable.module.css'
import cx from 'classnames'
import { useThrottle } from 'hooks/useThrottle'
import { useApi } from 'hooks/useApi'

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

const GearRow = ({ gear }) => {
  const api = useApi()

  return (
    <div className={styles.GearRow}>
      <EditableField
        value={gear.name}
        persistChange={(name) => api.gear.update({ id: gear.id, name })}
      />
      <EditableField
        className={styles.description}
        value={gear.description}
        persistChange={(description) =>
          api.gear.update({ id: gear.id, description })
        }
      />
      <div className={styles.weight}>
        {gear.grams.toLocaleString('en-US', { maximumFractionDigits: 1 })} g
      </div>
      <div className={styles.qty}>1</div>
    </div>
  )
}

// TODO make this a context powered thing
const useReadonly = () => false

const EditableField = ({ value, className, persistChange }) => {
  const readonly = useReadonly()

  const [state, setState] = useState(value)
  const throttledPersist = useThrottle(persistChange, 1000)
  // save changes every 1s
  const onChange = (e) => {
    setState(e.target.value)
    throttledPersist(e.target.value)
  }
  return (
    <input
      disabled={readonly}
      className={cx(styles.EditableField, className)}
      value={state}
      onChange={readonly ? undefined : onChange}
    />
  )
}
