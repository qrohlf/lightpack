import React from 'react'
import styles from './PackEditor.module.css'
import { queryConstants } from 'lib/queryConstants'
import { useQuery } from 'react-query'
import { PackEditorSection } from './PackEditorSection'
import { SectionsTable } from './SectionsTable'
import { PieChart } from 'common/PieChart'
import { LayoutFixed } from 'common/LayoutFixed'
import { colorSchemes } from 'lib/colorSchemes'
import { useParams } from 'react-router-dom'
import { useApi } from 'hooks/useApi'

const colorScheme = colorSchemes.metro

const colorForIndex = (i) => colorScheme[i % colorScheme.length]

export const PackEditor = ({ children, readonly }) => {
  const { shareId, packId } = useParams()
  const api = useApi()

  const getPack = readonly
    ? () => api.packs.showPublic({ shareId })
    : () => api.packs.show({ packId })

  const cacheKey = readonly
    ? queryConstants.PACKS.SHOW_PUBLIC
    : queryConstants.PACKS.SHOW

  const packQuery = useQuery([cacheKey, packId], getPack)

  return (
    <LayoutFixed>
      <div className={styles.PackEditor}>
        <div className={styles.sidePanel}>
          {packQuery.isSuccess && (
            <PieChart
              pack={packQuery.data.pack}
              colorForIndex={colorForIndex}
            />
          )}
          {packQuery.isSuccess && (
            <SectionsTable
              pack={packQuery.data.pack}
              colorForIndex={colorForIndex}
            />
          )}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {packQuery.isSuccess && (
              <>
                <Header pack={packQuery.data.pack} />
                <div className={styles.packContents}>
                  {packQuery.data.pack.packSections.map((s, i) => (
                    <PackEditorSection
                      key={s.id}
                      section={s}
                      color={colorForIndex(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/*<pre>{JSON.stringify(packQuery.data, null, '  ')}</pre>*/}
    </LayoutFixed>
  )
}

const Header = ({ pack }) => (
  <div className={styles.Header}>
    <h1>{pack.name}</h1>
    <p>Public link: /p/{pack.shareId}</p>
  </div>
)
