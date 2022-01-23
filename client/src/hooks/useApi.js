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
    packSections: {
      patch: (packSection, patch) => {
        // do the optimistic update - the problem here is that it's not
        // *quite* synchronous, which is enough to cause UI jank,
        // unfortunately
        updateCache.patchPackSection(packSection, patch)

        return req
          .patch(`packSections/${packSection.id}`, patch)
          .then(({ packSection: newPackSection }) => {
            // this one is a little funky - do another cache update but make sure not to replace the
            // gear?
          })
      },
    },
    gear: {
      patch: (gear, patch) => {
        // do the optimistic update
        updateCache.patchGear(gear, patch)

        return req
          .patch(`/gear/${gear.id}`, patch)
          .then(({ gear: newGear }) => {
            // do another cache update now that we have authoritative data from
            // the server
            updateCache.replaceGear(newGear)
          })
      },
    },
  }
}
