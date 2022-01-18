import React from 'react'
import styles from './Table.module.css'

export const Table = ({ template, header, rows }) => {
  return (
    <div className={styles.Table}>
      Table
      {children}
    </div>
  )
}
