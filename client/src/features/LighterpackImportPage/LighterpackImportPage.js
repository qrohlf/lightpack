import React from 'react'
import styles from './LighterpackImportPage.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from 'hooks/useApi'
import { useAuthState } from 'hooks/useAuth'
import { useEffectOnce } from 'hooks/useEffectOnce'

export const LighterpackImportPage = () => {
  const { lighterpackId } = useParams()
  const navigate = useNavigate()
  const api = useApi()
  const { currentUser } = useAuthState()

  // TODO refactor to useMutation
  useEffectOnce(() => {
    api.import.lighterpack({ lighterpackId }).then((result) => {
      const { pack } = result
      // prime the cache?
      currentUser
        ? navigate(`/packs/${pack.id}`) // user is logged in, we should go ahead and show them the editor
        : navigate(`/p/${pack.id}`) // no user logged in, show the read-only view
    })
  })

  return (
    <div className={styles.LighterpackImportPage}>
      Importing {lighterpackId} from Lighterpack
    </div>
  )
}
