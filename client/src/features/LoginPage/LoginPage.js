import React, { useState } from 'react'
import styles from './LoginPage.module.css'
import { LayoutFixed } from 'common/LayoutFixed'
import { NavLink, useNavigate } from 'react-router-dom'
import cx from 'classnames'
import { FormControl } from 'common/FormControl'
import { Button } from 'common/Button'
import { useAuth } from 'hooks/useAuth'

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
        <Button block loading={loading} type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  )
}

const LoginForm = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // dummy stuff
  const error = ''
  const FormError = (props) => <div {...props} />
  const loading = false

  const onSubmit = (e) => {
    e.preventDefault()
    auth.login({ email, password }).then(() => navigate('/pack/1'))
  }

  return (
    <div className={styles.content}>
      <h2>Log in</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <FormControl>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormError error={error} />
        <Button block loading={loading} type="submit">
          Log In
        </Button>
      </form>
    </div>
  )
}
