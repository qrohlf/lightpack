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
    get: (path, params) =>
      fetchJSON(API_ENDPOINT + path, null, {
        headers: authHeader,
        method: 'GET',
      }),
  }

  return {
    auth: {
      login: ({ email, password }) =>
        req.post('auth/login', { email, password }),
      logout: () => req.post('auth/logout'),
    },
    import: {
      lighterpack: ({ lighterpackId }) =>
        req.post('import/lighterpack', { lighterpackId }),
    },
    packs: {
      show: ({ packId }) => req.get(`packs/${packId}`),
    },
  }
}
