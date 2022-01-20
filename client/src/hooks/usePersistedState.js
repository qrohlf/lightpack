import { useState, useEffect } from 'react'

export const usePersistedState = ({ key, defaultValue, store }) => {
  const [state, setState] = useState(() => {
    const keyExistsInSession = !(store.getItem(key) === null)
    if (keyExistsInSession) {
      try {
        return JSON.parse(store.getItem(key))[key]
      } catch (e) {
        console.error(`error deserializing value for ${key}`, e)
      }
      return defaultValue
    }
    return defaultValue
  })

  useEffect(() => {
    try {
      // since there is is no store.has(key) => bool API,
      // use this {[key]: value} "envelope" so that we can represent the
      // "null" value without resetting to the initial state
      store.setItem(key, JSON.stringify({ [key]: state }))
    } catch (e) {
      console.error('Error persisting value to session storage')
    }
  }, [key, store, state])

  return [state, setState]
}
