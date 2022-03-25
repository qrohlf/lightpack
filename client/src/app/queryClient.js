import { QueryClient } from 'react-query'
import { queryConstants } from 'lib/queryConstants'
import produce from 'immer'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // todo bail early if error is from the API and not the network
    },
  },
})

export const updateCache = {
  patchGear: (gear, patch) => {
    queryClient.setQueryData([queryConstants.PACKS.SHOW, gear.packId], (old) =>
      produce(old, (draft) => {
        // figure out where our gear lives
        const packSectionIndex = draft.pack.packSections.findIndex(
          (ps) => ps.id === gear.packSectionId,
        )
        const gearIndex = draft.pack.packSections[
          packSectionIndex
        ].gear.findIndex((g) => g.id === gear.id)

        console.log({ packSectionIndex, gearIndex, gear })

        // do the optimistic partial update
        for (const [k, v] of Object.entries(patch)) {
          draft.pack.packSections[packSectionIndex].gear[gearIndex][k] = v
        }
      }),
    )
  },
  replaceGear: (gear) => {
    queryClient.invalidateCache([queryConstants.PACKS.SHOW, gear.packId])
    // queryClient.setQueryData([queryConstants.PACKS.SHOW, gear.packId], (old) =>
    //   produce(old, (draft) => {
    //     // figure out where our gear lives
    //     const packSectionIndex = draft.pack.packSections.findIndex(
    //       (ps) => ps.id === gear.packSectionId,
    //     )
    //     const gearIndex = draft.pack.packSections[
    //       packSectionIndex
    //     ].gear.findIndex((g) => g.id === gear.id)

    //     console.log({ packSectionIndex, gearIndex })
    //     // do the authoritative update
    //     draft.pack.packSections[packSectionIndex].gear[gearIndex] = gear
    //   }),
    // )
  },
  patchPackSection: (packSection, patch) => {
    console.log({ packSection })
    queryClient.setQueryData(
      [queryConstants.PACKS.SHOW, packSection.packId],
      (old) =>
        produce(old, (draft) => {
          // figure out where our section lives
          const packSectionIndex = draft.pack.packSections.findIndex(
            (ps) => ps.id === packSection.id,
          )

          console.log({ packSectionIndex, patch })

          // do the optimistic partial update
          for (const [k, v] of Object.entries(patch)) {
            draft.pack.packSections[packSectionIndex][k] = v
          }
        }),
    )
  },
}
