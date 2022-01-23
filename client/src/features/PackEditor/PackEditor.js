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
import { Popover } from 'common/Popover'
import { LoadablePage } from 'common/LoadablePage'
import { PackContents } from './PackContents'

const colorScheme = colorSchemes.metro

const colorForIndex = (i) => colorScheme[i % colorScheme.length]

export const PackEditor = ({ children, readonly }) => {
  const { shareId, packId: _packId } = useParams()
  const packId = +_packId
  const api = useApi()

  const publicQuery = useQuery(
    [queryConstants.PACKS.SHOW, shareId],
    () => api.packs.showPublic({ shareId }),
    { enabled: !!readonly },
  )

  const loggedInQuery = useQuery(
    [queryConstants.PACKS.SHOW, packId],
    () => api.packs.show({ id: packId }),
    { enabled: !readonly },
  )

  const packQuery = readonly ? publicQuery : loggedInQuery

  return (
    <LoadablePage query={packQuery}>
      {() => (
        <LayoutFixed>
          <div className={styles.PackEditor}>
            <div className={styles.sidePanel}>
              <PieChart
                pack={packQuery.data.pack}
                colorForIndex={colorForIndex}
              />
              <SectionsTable
                pack={packQuery.data.pack}
                colorForIndex={colorForIndex}
              />
            </div>
            <div className={styles.mainContent}>
              <div className={styles.contentContainer}>
                <Header pack={packQuery.data.pack} />
                <div className={styles.packContents}>
                  <PackContents pack={packQuery.data.pack} />
                  {false &&
                    packQuery.data.pack.packSections.map((s, i) => (
                      <PackEditorSection
                        key={s.id}
                        section={s}
                        color={colorForIndex(i)}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </LayoutFixed>
      )}
    </LoadablePage>
  )
}

const Header = ({ pack }) => (
  <div className={styles.Header}>
    <h1>{pack.name}</h1>
    <div className={styles.headerActions}>
      <Popover
        trigger="Share"
        buttonProps={{ subtle: true, style: { marginRight: 5 } }}
      >
        <p>
          Public link:{' '}
          <a href={`/p/${pack.shareId}`} target="_blank" rel="noreferrer">
            /p/{pack.shareId}
          </a>
        </p>
      </Popover>
      <Popover
        trigger="Options"
        buttonProps={{ subtle: true, style: { marginRight: -15 } }}
      >
        <p>Color scheme, duplicate, delete, units, etc</p>
      </Popover>
    </div>
  </div>
)
