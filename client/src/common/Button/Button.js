import React from 'react'
import styles from './Button.module.css'
import cx from 'classnames'

const partitionObject = (object, filter) => {
  const matching = {}
  const rest = {}
  for (const [k, v] of Object.entries(object)) {
    if (filter(k, v)) {
      matching[k] = v
    } else {
      rest[k] = v
    }
  }

  return { matching, rest }
}

export const Button = React.forwardRef(({ element, ..._props }, ref) => {
  const { matching: classNames, rest: notStyles } = partitionObject(
    _props,
    (k) => styles[k],
  )

  const variants = Object.keys(classNames)
    .filter((k) => classNames[k])
    .map((k) => styles[k])

  const props = {
    ...notStyles,
    className: cx(styles.Button, variants),
  }

  if (element) {
    return React.cloneElement(element, props)
  }

  return <button ref={ref} {...props} />
})
