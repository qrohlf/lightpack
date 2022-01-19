import React from 'react'
import styles from './FormControl.module.css'
import cx from 'classnames'

export const FormControl = ({ children, inline, className }) => {
  return (
    <div className={cx(className, styles.FormControl, inline && styles.inline)}>
      {children}
    </div>
  )
}
