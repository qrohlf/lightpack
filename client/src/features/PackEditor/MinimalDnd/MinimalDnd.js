import React, { useState } from 'react'
import {
  DndContext,
  closestCenter,
  rectIntersection,
  pointerWithin,
  getFirstCollision,
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

/*
Minimal dndkit implementation for editing pack content!

Some notes:
- right now, we're not using a DragOverlay. This means that we don't get the
  nice return-home animations on drag release, and we don't get a "preview"
  of the thing that we're dragging in its new home
- when we incorporate gear sorting, we'll likely need to bring in a custom
  collision detection strategy!
*/

// In order to play nice with dnd-kit, we need to
// (1) inject a stringId for each item
// and
// (2) sort both packSections and gear by rank

// okay so this sort of works but it's still nowhere near as smooth as the DndDemo.
//
// I think the correct approach is now to go ahead and take the state management
// approach from here, and combine it with the DndDemo to see if we can get
// something usable and performant
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
  const [activeId, setActiveId] = useState(null)
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
  const collisionDetectionStrategy = (args) => {
    // if we're dragging a packSection, only count other packSections as
    // droppable
    if (isPackSectionId(activeId)) {
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter((container) =>
          isPackSectionId(container.id),
        ),
      })
    }

    // otherwise, we're dragging a gear item. We want to find relevant
    // intersections - if there's a droppable item below the pointer, use
    // that, otherwise use a rect-intersection strategy to figure out what
    // we might be trying to drop into
    const pointerIntersections = pointerWithin(args)
    const intersections =
      pointerIntersections.length > 0
        ? pointerIntersections
        : rectIntersection(args)

    // grab the ID of the first collision item
    const overId = getFirstCollision(intersections, 'id')
    // if we're dealing with a non-empty pack section, find the closest droppable
    // packItem within that section
    if (overId !== null && isPackSectionId(overId)) {
      const packSection = packSections.find((ps) => ps.stringId === overId)
      if (packSection.gear.length > 0) {
        const isInPackSection = (gearStringId) =>
          packSection.gear.some((g) => g.stringId === gearStringId)
        const closestItemIdWithinSection = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            isInPackSection(container.id),
          ),
        })[0]?.id

        return [{ id: closestItemIdWithinSection }]
      }
    }

    // if nothing is matched, return []
    // TODO - return lastOverId
    return []
  }

  return (
    <DndContext
      sensors={dndSensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={({ active }) => {
        setActiveId(active.id)
      }}
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

    if (!over) {
      // we dropped over nothing, cancel the drag
      setActiveId(null)
      return
    }

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
