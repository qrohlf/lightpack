import React from 'react'
import styles from './PackEditor.module.css'
import { queryConstants } from 'lib/queryConstants'
import { useQuery } from 'react-query'
import { api } from 'lib/api'

export const PackEditor = ({ children }) => {
  const token = ''
  const packId = 1
  const packQuery = useQuery([queryConstants.PACKS.SHOW, packId], () =>
    api.packs.show(token, packId),
  )
  return (
    <div className={styles.PackEditor}>
      PackEditor
      <pre>{JSON.stringify(packQuery.data, null, '  ')}</pre>
    </div>
  )
}
