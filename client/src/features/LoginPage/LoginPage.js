import React from 'react'
import styles from './LoginPage.module.css'
import { LayoutFixed } from 'common/LayoutFixed'
import { NavLink } from 'react-router-dom'
import cx from 'classnames'
import { FormControl } from 'common/FormControl'
import { Button } from 'common/Button'

export const LoginPage = ({ children, isLogin }) => {
  return (
    <LayoutFixed>
      <div className={styles.LoginPage}>
        <div className={styles.FloatingBox}>
          <div className={styles.header}>
            <NavLink
              className={({ isActive }) =>
                cx(styles.headerLink, isActive && styles.active)
              }
              to="/signup"
            >
              Sign Up
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                cx(styles.headerLink, isActive && styles.active)
              }
              to="/login"
            >
              Log In
            </NavLink>
          </div>
          {isLogin ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </LayoutFixed>
  )
}

const SignupForm = () => {
  const email = ''
  const error = ''
  const password = ''
  const FormError = (props) => <div {...props} />
  const loading = false
  return (
    <div className={styles.content}>
      <h2>Create a free account to get started</h2>
      <form className={styles.form} onSubmit={() => {}}>
        <FormControl>
          <label>Email</label>
          <input type="email" value={email} onChange={() => {}} />
        </FormControl>
        <FormControl>
          <label>Password</label>
          <input type="password" value={password} onChange={() => {}} />
        </FormControl>
        <FormError error={error} />
        <Button block loading={loading} primary type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

const LoginForm = () => {
  const email = ''
  const error = ''
  const password = ''
  const FormError = (props) => <div {...props} />
  const loading = false
  return (
    <div className={styles.content}>
      <h2>Log in</h2>
      <form className={styles.form} onSubmit={() => {}}>
        <FormControl>
          <label>Email</label>
          <input type="email" value={email} onChange={() => {}} />
        </FormControl>
        <FormControl>
          <label>Password</label>
          <input type="password" value={password} onChange={() => {}} />
        </FormControl>
        <FormError error={error} />
        <Button block loading={loading} primary type="submit">
          Log In
        </Button>
      </form>
    </div>
  )
}
