import React from 'react'
import styles from './Navbar.module.css'
import { Link } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'
import { Button } from 'common/Button'

export const Navbar = ({ children }) => {
  const {
    authState: { currentUser },
    logout,
  } = useAuth()
  return (
    <div className={styles.Navbar}>
      <Link className={styles.logoContainer} to="/">
        <div className={styles.logoImg}>🎒</div>{' '}
        <h1 className={styles.siteTitle}>Lightpack</h1>
      </Link>
      <div className={styles.actions}>
        {currentUser && (
          <Button subtle onClick={logout}>
            Sign Out
          </Button>
        )}
        {!currentUser && (
          <Link to="/signup" data-appearance="button">
            Sign Up
          </Link>
        )}
      </div>
    </div>
  )
}
