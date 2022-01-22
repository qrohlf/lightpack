import React from 'react'
import styles from './LoadingPage.module.css'

export const LoadingPage = ({ children }) => {
  return (
    <div className={styles.LoadingPage}>
      LoadingPage
      {children}
    </div>
  )
}
