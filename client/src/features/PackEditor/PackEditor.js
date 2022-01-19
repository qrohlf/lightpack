import React from 'react'
import styles from './PackEditor.module.css'
import { queryConstants } from 'lib/queryConstants'
import { useQuery } from 'react-query'
import { api } from 'lib/api'
import { PackEditorSection } from './PackEditorSection'
import { SectionsTable } from './SectionsTable'
import { PieChart } from 'common/PieChart'
import { LayoutFixed } from 'common/LayoutFixed'
import { colorSchemes } from 'lib/colorSchemes'

const colorScheme = colorSchemes.metro

const colorForIndex = (i) => colorScheme[i % colorScheme.length]

export const PackEditor = ({ children }) => {
  const token = ''
  const packId = 3
  const packQuery = useQuery([queryConstants.PACKS.SHOW, packId], () =>
    api.packs.show(token, packId),
  )
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
    {/*<p>{pack.description}</p>*/}
  </div>
)
