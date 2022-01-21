import { useEffect } from 'react'
// eslint-disable-next-line
export const useEffectOnce = (effect) => useEffect(effect, [])
