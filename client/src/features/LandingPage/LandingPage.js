import React from 'react'
import styles from './LandingPage.module.css'

export const LandingPage = ({ children }) => {
  return (
    <div className={styles.LandingPage}>
      LandingPage
      {children}
    </div>
  )
}
