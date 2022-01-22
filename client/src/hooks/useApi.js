import { fetchJSON } from 'lib/fetchJSON'
import { useAuthState } from 'hooks/useAuth'
import { updateCache } from 'app/queryClient'

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
    patch: (path, body) =>
      fetchJSON(API_ENDPOINT + path, body, {
        headers: authHeader,
        method: 'PATCH',
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
      index: () => req.get('/packs'),
      show: ({ id }) => req.get(`packs/${id}`),
      showPublic: ({ shareId }) => req.get(`packs/public/${shareId}`),
    },
    gear: {
      patch: (gear, patch) => {
        // do the optimistic update
        updateCache.patchGear(gear, patch)

        req.patch(`/gear/${gear.id}`, patch).then(({ gear: newGear }) => {
          // do another cache update now that we have authoritative data from
          // the server
          updateCache.replaceGear(newGear)
        })
      },
    },
  }
}
