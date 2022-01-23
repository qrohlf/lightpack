import React from 'react'
import styles from './ErrorPage.module.css'
import { Layout } from 'common/Layout'

export const ErrorPage = ({ children }) => {
  return (
    <Layout>
      <div className={styles.ErrorPage}>
        ErrorPage
        {children}
      </div>
    </Layout>
  )
}
