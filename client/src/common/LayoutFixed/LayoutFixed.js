import React from 'react'
import styles from './LayoutFixed.module.css'
import { Navbar } from 'common/Navbar'

export const LayoutFixed = ({ children, ...props }) => {
  return (
    <div className={styles.LayoutFixed} {...props}>
      <Navbar />
      <div className={styles.main}>{children}</div>
    </div>
  )
}
