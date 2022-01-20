import React from 'react'
import styles from './Button.module.css'
import cx from 'classnames'

export const Button = ({ children, className, ...allProps }) => {
  const { classNames, props } = Object.entries(allProps).reduce(
    ({ classNames, props }, [k, v]) => {
      if (styles[k] && v) {
        // key is a classname and value is true, add it to the list
        return { classNames: [...classNames, styles[k]], props }
      } else if (styles[k]) {
        // key is a classname and value is false, noop
        return { classNames, props }
      } else {
        // key is a prop
        return { classNames, props: { ...props, [k]: v } }
      }
    },
    { classNames: [], props: {} },
  )

  // TODO loading state with spinner!

  return (
    <button className={cx(styles.Button, className, ...classNames)} {...props}>
      {children}
    </button>
  )
}
