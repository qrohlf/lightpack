import { fetchJSON } from 'lib/fetchJSON'
import { useAuthState } from 'hooks/useAuth'

const API_ENDPOINT = '/api/'

export const useApi = () => {
  const { token } = useAuthState()
  const authHeader = token ? { Authorization: token.token } : {}

  const req = {
    post: (path, body) =>
      fetchJSON(API_ENDPOINT + path, body, {
        headers: authHeader,
        method: 'POST',
      }),
  }

  return {
    auth: {
      login: ({ email, password }) =>
        req.post('auth/login', { email, password }),
      logout: () => req.post('auth/logout'),
    },
  }
}
