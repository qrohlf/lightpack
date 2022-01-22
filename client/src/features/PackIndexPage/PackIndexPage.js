import React from 'react'
import styles from './PackIndexPage.module.css'
import { Layout } from 'common/Layout'
import { queryConstants } from 'lib/queryConstants'
import { useQuery } from 'react-query'
import { useApi } from 'hooks/useApi'
import { LoadablePage } from 'common/LoadablePage'
import { Link } from 'react-router-dom'

export const PackIndexPage = () => {
  const api = useApi()
  const packsQuery = useQuery(queryConstants.PACKS.INDEX, () =>
    api.packs.index(),
  )
  return (
    <LoadablePage query={packsQuery}>
      {() => (
        <Layout>
          <div className={styles.PackIndexPage}>
            <h1>Your Lists</h1>
            <PackList packs={packsQuery.data.packs} />

            {/* TODO - "create new" button */}
          </div>
        </Layout>
      )}
    </LoadablePage>
  )
}

const PackList = ({ packs }) =>
  packs.map((p) => (
    <div className={styles.PackListItem}>
      <Link to={`/packs/${p.id}`}>{p.name}</Link>
    </div>
  ))
