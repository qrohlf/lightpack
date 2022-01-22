import React from 'react'
import styles from './Layout.module.css'
import { Navbar } from 'common/Navbar'

export const Layout = ({ children, ...props }) => {
  return (
    <div className={styles.Layout} {...props}>
      <Navbar />
      <div className={styles.main}>{children}</div>
    </div>
  )
}
