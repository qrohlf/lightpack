import React, { useContext } from 'react'
import { usePersistedState } from 'hooks/usePersistedState'
import { useNavigate } from 'react-router-dom'
import { useApi } from 'hooks/useApi'

const AuthContext = React.createContext(null)

export const AuthProvider = ({ children }) => {
  const value = usePersistedState({
    key: 'auth',
    defaultValue: { currentUser: null, token: null },
    store: localStorage,
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// read-only
export const useAuthState = () => useContext(AuthContext)[0]

// TODO
// - refactor this to the context/singleton model, so that all useAuth instances
//   are shared
// - refactor the api call to go through an API abstraction layer of some kind?
//   or maybe useMutation???
export const useAuth = () => {
  const [authState, setAuthState] = useContext(AuthContext)
  const api = useApi()

  // maybe stop using navigate here and hoist this logic back up into the Provider!
  const navigate = useNavigate()

  return {
    authState,
    signup: () => {},
    login: ({ email, password }) =>
      api.auth
        .login({ email, password })
        .then(({ user, token }) => setAuthState({ currentUser: user, token })),
    logout: () =>
      api.auth.logout().finally(() => {
        setAuthState({ currentUser: null, token: null })
        navigate('/login')
      }),
  }
}
