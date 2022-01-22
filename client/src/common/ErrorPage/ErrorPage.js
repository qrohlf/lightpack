import React from 'react'
import styles from './ErrorPage.module.css'

export const ErrorPage = ({ children }) => {
  return (
    <div className={styles.ErrorPage}>
      ErrorPage
      {children}
    </div>
  )
}
