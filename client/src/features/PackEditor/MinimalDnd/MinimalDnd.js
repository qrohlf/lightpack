import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  useSortable,
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { getRank } from 'lib/getRank'
import { CSS } from '@dnd-kit/utilities'
import { useApi } from 'hooks/useApi'
import _ from 'lodash'
import { PackEditorSection } from '../PackEditorSection'

// In order to play nice with dnd-kit, we need to
// (1) inject a stringId for each item
// and
// (2) sort both packSections and gear by rank
const sortAndInjectRankingsAndIds = (
  items,
  localRankMappings,
  idPrefix = 'ps',
) => {
  const withRankingsAndIds = items.map((item) => ({
    ...item,
    stringId: `${idPrefix}_${item.id}`,
    rank: localRankMappings[item.id] || item.rank,
    gear: item.gear
      ? sortAndInjectRankingsAndIds(item.gear, localRankMappings, 'g')
      : undefined,
  }))

  return _.sortBy(withRankingsAndIds, 'rank')
}

const isPackSectionId = (id) => id.startsWith('ps_')

export function MinimalDnd({ packQuery, colorForIndex }) {
  const api = useApi()

  // TODO - nuke local rank mappings when the tab loses focus!
  const [localRankMappings, setLocalRankMappings] = useState({})
  const packSections = sortAndInjectRankingsAndIds(
    packQuery.data.pack.packSections,
    localRankMappings,
  )

  const updateLocalRank = (id, newRank) =>
    setLocalRankMappings((mappings) => ({ ...mappings, [id]: newRank }))

  const reorderPackSection = (activeId, overId) => {
    const activeIndex = packSections.findIndex((ps) => ps.stringId === activeId)
    const activeSection = packSections[activeIndex]
    const overIndex = packSections.findIndex((ps) => ps.stringId === overId)
    const newOrder = arrayMove(packSections, activeIndex, overIndex)

    const rankBefore = newOrder[overIndex - 1]?.rank
    const rankAfter = newOrder[overIndex + 1]?.rank
    const newRank = getRank(rankBefore, rankAfter)
    console.log({ moveTo: overIndex, rankBefore, newRank, rankAfter })

    // tell the server about it
    api.packSections.patch(activeSection, { rank: newRank })

    // and then also update the rank locally
    updateLocalRank(activeSection.id, newRank)
  }

  const dndSensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  return (
    <DndContext
      sensors={dndSensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={packSections.map((ps) => ps.stringId)}
        strategy={verticalListSortingStrategy}
      >
        {packSections.map((ps, index) => (
          <SortablePackSection
            key={ps.id}
            index={index}
            colorForIndex={colorForIndex}
            packSection={ps}
          />
        ))}
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id && isPackSectionId(active.id)) {
      reorderPackSection(active.id, over.id)
    }
  }
}

export function SortablePackSection({ packSection, index, colorForIndex }) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: packSection.stringId, data: { packSection } })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const handleProps = { ...attributes, ...listeners }

  return (
    <PackEditorSection
      color={colorForIndex(index)}
      packSection={packSection}
      ref={setNodeRef}
      style={style}
      handleProps={handleProps}
      isDragging={isDragging}
    />
  )
}
