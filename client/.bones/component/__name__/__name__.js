import React from 'react'
import styles from './__name__.module.css'

export const __name__ = ({ children }) => {
  return (
    <div className={styles.__name__}>
      __name__
      {children}
    </div>
  )
}
