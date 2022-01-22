import React, { useState, useEffect } from 'react'
import styles from './GearItemsTable.module.css'
import cx from 'classnames'
import { useThrottle } from 'hooks/useThrottle'
import { useApi } from 'hooks/useApi'
import { getSectionWeight, getSectionQty } from 'lib/packUtils'
import { Weight } from 'common/Weight'

export const GearItemsTable = ({ section }) => {
  const gear = section.gear
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

const TotalRow = ({ section }) => {
  const sectionWeight = getSectionWeight(section)
  return (
    <div className={styles.GearFooter}>
      <div>{/*description*/}</div>
      <div>{/*description*/}</div>
      <div className={styles.totalLabel}>{/*Total*/}</div>
      <div className={cx(styles.weight, styles.weightTotal)}>
        <Weight g={sectionWeight} type="section" />
      </div>
      <div className={cx(styles.qty, styles.qtyTotal)}>
        {getSectionQty(section)}
      </div>
    </div>
  )
}

const GearHeader = () => (
  <div className={styles.GearHeader}>
    <div>Item</div>
    <div>{/*description*/}</div>
    <div>{/*modifiers*/}</div>
    <div className={styles.weight}>Weight</div>
    <div className={styles.qty}>Qty</div>
  </div>
)

const GearRow = ({ gear }) => {
  const api = useApi()
  const toggleModifier = (modifier) =>
    api.gear.patch(gear, { [modifier]: !gear[modifier] })

  return (
    <div className={styles.GearRow}>
      <EditableField
        value={gear.name}
        persistChange={(name) => api.gear.patch(gear, { name })}
      />
      <EditableField
        className={styles.description}
        value={gear.description}
        persistChange={(description) => api.gear.patch(gear, { description })}
      />
      <div className={styles.modifiers}>
        {/* worn weight - todo: make this a button! */}
        <span
          className={styles.modifierEmoji}
          data-active={gear.worn}
          onClick={() => toggleModifier('worn')}
        >
          👕
        </span>
        {/* consumable */}
        <span
          className={styles.modifierEmoji}
          data-active={gear.consumable}
          onClick={() => toggleModifier('consumable')}
        >
          🌮
        </span>
      </div>
      <div className={styles.weight}>
        <Weight g={gear.grams} type="gear" />
      </div>
      <EditableField
        className={styles.qty}
        value={gear.qty}
        persistChange={(qty) => api.gear.patch(gear, { qty: +qty })}
        inputProps={{ type: 'number', min: 0 }}
        throttle={0}
      />
    </div>
  )
}

// TODO make this a context powered thing
const useReadonly = () => false

const EditableField = ({
  value,
  className,
  persistChange,
  inputProps,
  throttle,
}) => {
  const readonly = useReadonly()

  const [state, setState] = useState(value)
  const throttledPersist = useThrottle(persistChange, throttle)

  const persist = throttle > 0 ? throttledPersist : persistChange
  // save changes every 1s
  const onChange = (e) => {
    setState(e.target.value)
    persist(e.target.value)
  }
  return (
    <input
      {...inputProps}
      disabled={readonly}
      className={cx(styles.EditableField, className)}
      value={state}
      onChange={readonly ? undefined : onChange}
    />
  )
}

EditableField.defaultProps = {
  throttle: 1000,
}
