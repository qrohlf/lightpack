import React from 'react'
import styles from './PackEditor.module.css'
import { queryConstants } from 'lib/queryConstants'
import { useQuery } from 'react-query'
import { api } from 'lib/api'

export const PackEditor = ({ children }) => {
  const token = ''
  const packId = 2
  const packQuery = useQuery([queryConstants.PACKS.SHOW, packId], () =>
    api.packs.show(token, packId),
  )
  return (
    <>
      <div className={styles.PackEditor}>
        <div className={styles.sidePanel}>
          <h3>Weight Breakdown</h3>
          {packQuery.isSuccess && <WaffleChart pack={packQuery.data.pack} />}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.contentContainer}>
            {packQuery.isSuccess && (
              <>
                <Header pack={packQuery.data.pack} />
                <div className={styles.packContents}>
                  {packQuery.data.pack.packSections.map((s) => (
                    <PackSection key={s.id} section={s} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/*<pre>{JSON.stringify(packQuery.data, null, '  ')}</pre>*/}
    </>
  )
}

// each cell corresponds to 30g (in metric mode) or 1oz (in imperial mode)
const WaffleChart = ({ pack }) => {
  const cells = []
  // 30% tent
  for (let i = 0; i < 29 * 2; i++) {
    cells.push(<div style={{ background: '#5BC9E2' }} />)
  }
  // 20% something else
  for (let i = 0; i < 20 * 2; i++) {
    cells.push(<div style={{ background: '#98D3CF' }} />)
  }
  // 19% sleep
  for (let i = 0; i < 16 * 2; i++) {
    cells.push(<div style={{ background: '#D9DEC1' }} />)
  }
  // 17% pack
  for (let i = 0; i < 19 * 2; i++) {
    cells.push(<div style={{ background: '#ED7125' }} />)
  }
  // 13% something else
  for (let i = 0; i < 13 * 2; i++) {
    cells.push(<div style={{ background: '#F55207' }} />)
  }

  return <div className={styles.WaffleChart}>{cells}</div>
}

const Header = ({ pack }) => (
  <div className={styles.Header}>
    <h1>{pack.name}</h1>
  </div>
)

const PackSection = ({ section }) => (
  <div className={styles.PackSection}>
    <h2>{section.name}</h2>
    <GearHeader />
    {section.gear.map((g) => (
      <Gear key={g.id} gear={g} />
    ))}
  </div>
)

const GearHeader = () => (
  <div className={styles.GearHeader}>
    <div>Item</div>
    <div>{/*description*/}</div>
    <div>Weight</div>
    <div>Qty</div>
  </div>
)

const Gear = ({ gear }) => (
  <div className={styles.Gear}>
    <div>{gear.name}</div>
    <div>{gear.description}</div>
    <div>
      {gear.grams.toLocaleString('en-US', { maximumFractionDigits: 1 })} g
    </div>
    <div>1</div>
  </div>
)
