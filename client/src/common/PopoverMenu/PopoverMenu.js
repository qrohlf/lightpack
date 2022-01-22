import React from 'react'
import styles from './PopoverMenu.module.css'

export const PopoverMenu = ({ children }) => {
  return (
    <div className={styles.PopoverMenu}>
      PopoverMenu
      {children}
    </div>
  )
}
