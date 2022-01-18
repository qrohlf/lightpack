import React from 'react'
import styles from './Navbar.module.css'

export const Navbar = ({ children }) => {
  return (
    <div className={styles.Navbar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoImg}>🎒</div>{' '}
        <h1 className={styles.siteTitle}>Lightpack</h1>
      </div>
    </div>
  )
}
