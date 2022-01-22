import React, { useState } from 'react'
import styles from './GearItemsTable.module.css'
import cx from 'classnames'
import { useThrottle } from 'hooks/useThrottle'
import { useApi } from 'hooks/useApi'
import { getSectionWeight, getSectionQty } from 'lib/packUtils'
import { Weight, toOz } from 'common/Weight'
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

/*
TODO - grab handles and delete button
*/
const GearRow = ({ gear }) => {
  const api = useApi()
  const toggleModifier = (modifier) =>
    api.gear.patch(gear, { [modifier]: !gear[modifier] })

  return (
    <div className={styles.GearRow} data-qty={gear.qty}>
      <EditableField
        className={styles.name}
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
        <WeightEditor gear={gear} />
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

// FIXME all the stuff below should really be in its own component

const isNumeral = '1234567890'.split('').reduce((map, c) => {
  map[c] = true
  return map
}, {})

const filterChars = (str) => {
  let newStr = []
  let hasDecimal = false
  for (const c of str) {
    if (isNumeral[c]) {
      newStr.push(c)
    }
    if (c === '.' && !hasDecimal) {
      hasDecimal = true
      newStr.push(c)
    }
  }
  return newStr.join('')
}

const toGrams = (float, units) => {
  if (units !== 'oz') {
    throw Error()
  }
  return float / 0.03527396195
}

const WeightEditor = ({ gear }) => {
  const api = useApi()

  // TODO - power this with the units context
  const initialValue = toOz(gear.grams).toLocaleString('en', {
    useGrouping: false,
    maximumFractionDigits: 2,
  })
  const [string, setString] = useState(initialValue)

  // reset to our authoritative value on blur, rather than retaining N sig figs
  const onBlur = () => {
    setString(initialValue)
  }
  const units = 'oz'

  const onChange = (e) => {
    const str = filterChars(e.target.value)
    console.log({ str })
    setString(str)
    const parsed = parseFloat(str)
    if (Number.isFinite(parsed)) {
      const grams = toGrams(parsed, units)
      api.gear.patch(gear, { grams })
    }
  }
  const onChangeUnits = (e) => console.log({ onChangeUnits: e.target.value })

  // return <Weight g={gear.grams} type="gear" />
  return (
    <div className={styles.WeightEditor}>
      <input
        value={'' + string}
        className={cx(styles.EditableField, styles.weightEditorInput)}
        onChange={onChange}
        onBlur={onBlur}
      />
      <select value={units} onChange={onChangeUnits} tabIndex="-1">
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="oz">oz</option>
        <option value="lb">lb</option>
      </select>
    </div>
  )
}
