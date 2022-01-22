import _ from 'lodash'
import { useRef, useEffect, useCallback } from 'react'

export const useThrottle = (cb, delay) => {
  const options = { leading: false, trailing: true } // add custom lodash options
  const cbRef = useRef(cb)
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb
  })
  // eslint-disable-next-line
  return useCallback(
    _.throttle((...args) => cbRef.current(...args), delay, options),
    [delay],
  )
}
