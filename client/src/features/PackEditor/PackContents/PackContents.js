import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  closestCenter,
  pointerWithin,
  rectIntersection,
  DndContext,
  DragOverlay,
  getFirstCollision,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  MeasuringStrategy,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import produce from 'immer'
import { CSS } from '@dnd-kit/utilities'

import { Container } from './components/Container'
import { Item } from './components/Item'
import { getRank } from 'lib/getRank'
import { useApi } from 'hooks/useApi'
import _ from 'lodash'

const dropAnimation = {
  duration: 300,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
}

export function PackContents({
  adjustScale = false,
  itemCount = 3,
  cancelDrop,
  columns,
  handle = true,
  items: initialItems,
  containerStyle,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  scrollable,
  pack,
}) {
  const api = useApi()
  // TODO: nuke the mask here when the packQuery reloads!
  const [sectionRankMappingMask, setSectionRankMappingMask] = useState({})
  const sectionsWithRankInjected = pack.packSections.map((ps) => ({
    ...ps,
    rank: sectionRankMappingMask[ps.id] || ps.rank,
  }))

  const serverPackSections = _.sortBy(sectionsWithRankInjected, (ps) => ps.rank)

  // okay, so here's the rub: in order to properly render the draggable
  // interface, we're going to have to be able to move gear items in between
  // pack sections without serializing that state change back to the server.
  //
  // basically, when a drag interaction starts, we want to switch to using
  // a local copy of packSections, and then when it ends and we know that
  // react-query has caught up to our local changes, we want to go back to
  // using the authoritative version from react-query
  const [localPackSections, setLocalPackSections] = useState(null)
  const packSections = localPackSections || serverPackSections

  const [items, setItems] = useState(() =>
    pack.packSections.reduce(
      (obj, ps) => ({
        ...obj,
        [ps.id]: ps.gear.map((g) => g.name),
      }),
      {},
    ),
  )

  // stupid string casting has to happen here because of how object keys
  // are always strings. We can remove this once we're no longer relying on the
  // 'items' map
  const containers = packSections.map((ps) => '' + ps.id)

  const reorderPackSection = ({ activeId, targetId }) => {
    const activeIndex = packSections.findIndex((ps) => ps.id === +activeId)
    const activeSection = packSections[activeIndex]
    const overIndex = packSections.findIndex((ps) => ps.id === +targetId)
    const newOrder = arrayMove(packSections, activeIndex, overIndex)

    const rankBefore = newOrder[overIndex - 1]?.rank
    const rankAfter = newOrder[overIndex + 1]?.rank
    const newRank = getRank(rankBefore, rankAfter)
    console.log({ moveTo: overIndex, rankBefore, newRank, rankAfter })

    // because the optimistic update in api.packSections.mask isn't synchronous,
    // it will result in UI jank when dropping a section. In order to avoid that,
    // this component will locally update the section rank using an override mask
    // first
    setSectionRankMappingMask((mask) => ({
      ...mask,
      [activeSection.id]: newRank,
    }))
    api.packSections.patch(activeSection, { rank: newRank })
  }

  const moveGearBetweenSectionsLocally = ({
    gearId,
    toSectionId,
    insertAtIndex,
  }) => {
    setLocalPackSections((packSections) =>
      produce(packSections, (draft) => {
        // janky way of finding the gear (remove when we're able to put gear in
        // active.data.current.gear)

        // NOTE THAT RIGHT NOW, GEARID IS ACTUALLY gear.name. We will change
        // this eventually
        debugger
        const gear = packSections
          .reduce((gear, ps) => [...gear, ...ps.gear], [])
          .find((g) => g.name === gearId)
        const oldSectionIndex = draft.findIndex(
          (ps) => ps.id === gear.packSectionId,
        )
        const newSectionIndex = draft.findIndex((ps) => ps.id === +toSectionId)
        if (newSectionIndex === oldSectionIndex) {
          throw Error('you goofed')
        }
        // first, remove the gear from the old section
        packSections[oldSectionIndex].gear = packSections[
          oldSectionIndex
        ].gear.filter((g) => g.name !== gearId)
        // next, add the gear as the last item in the new section
        const newGear = {
          ...gear,
          packSectionId: packSections[newSectionIndex].id,
        }
        packSections[newSectionIndex].gear.push(newGear)
      }),
    )
  }

  const [dragItem, setDragItem] = useState(null)

  // Some of this could probably be wrapped up into a custom hook with the collisionDetectionStrategy
  const lastOverId = useRef(null)
  const recentlyMovedToNewContainer = useRef(false)
  // this is used to disable the sortables inside the pack section while the
  // pack section is being dragged
  const isSortingPackSection = dragItem?.data.current.type === 'packSection'
  const isSortingGear = dragItem?.data.current.type === 'gear'

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // if we're dragging a packSection, only look at other packSections when
      // determining the drop target
      if (isSortingPackSection) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (container) => container.data.current.type === 'packSection',
          ),
        })
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId != null) {
        if (overId in items) {
          const containerItems = items[overId]

          // If a container is matched and it contains items (columns 'A', 'B', 'C')
          if (containerItems.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.includes(container.id),
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = dragItem.id
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [dragItem, items, isSortingPackSection],
  )
  const [clonedItems, setClonedItems] = useState(null)
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
  const findContainer = (id) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const getIndex = (id) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = items[container].indexOf(id)

    return index
  }

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      // TODO FIXME figure out what this does
      setItems(clonedItems)
    }

    setDragItem(null)
    setClonedItems(null)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [items])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        // keep track of what we're currently dragging
        setDragItem(active)
        // switch over to using local state for the pack sections while
        // dragging
        setLocalPackSections(serverPackSections)
        // (legacy) clone the "items" stuff so that we can revert
        // if needed
        setClonedItems(items)
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id

        if (active.id in items) {
          // if we're dragging a packSection, return early and don't
          // commit drag actions in onDragOver
          return
        }

        const overContainer = findContainer(overId)
        const activeContainer = findContainer(active.id)

        if (!overContainer || !activeContainer) {
          return
        }

        if (activeContainer !== overContainer) {
          // okay, so if we get here, then we're moving a gear item between
          // two pack sections.
          //
          // there are two possible scenarios to handle:
          //
          // (1) the item we're hovering over is a packSection, in which case we
          // want to add our gear item to the end of this packSection. This
          // generally only occurs if the target packSection is empty
          // if (over?.data.current.type === 'packSection') {
          //   moveGearBetweenSectionsLocally({
          //     gearId: active.id,
          //     toSectionId: over.id,
          //   })
          // }
          // // (2) the item we're hovering over is a gear item, in which case we
          // // want to insert our gear item either above or below this existing
          // // gear item
          // if (over?.data.current.type === 'gear') {
          //   const isBelowOverItem =
          //     over &&
          //     active.rect.current.translated &&
          //     active.rect.current.translated.top >
          //       over.rect.top + over.rect.height
          //   if (isBelowOverItem) {
          //     moveGearBetweenSectionsLocally({
          //       gearId: active.id,
          //       toSectionId: over.id, // ugh, see if we had the gearId here, we'd be set.
          //       afterGearId: over.data.current.id,
          //     })
          //   } else {
          //     moveGearBetweenSectionsLocally({
          //       gearId: active.id,
          //       toSectionId: over.id,
          //       beforeGearId: over.data.current.id,
          //     })
          //   }
          // }

          // old and crufty and we want to delete it
          setItems((items) => {
            const activeItems = items[activeContainer]
            const overItems = items[overContainer]
            const overIndex = overItems.indexOf(overId)
            const activeIndex = activeItems.indexOf(active.id)

            let newIndex

            if (overId in items) {
              newIndex = overItems.length + 1
            } else {
              const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top >
                  over.rect.top + over.rect.height

              const modifier = isBelowOverItem ? 1 : 0

              newIndex =
                overIndex >= 0 ? overIndex + modifier : overItems.length + 1
            }

            recentlyMovedToNewContainer.current = true

            return {
              ...items,
              [activeContainer]: items[activeContainer].filter(
                (item) => item !== active.id,
              ),
              [overContainer]: [
                ...items[overContainer].slice(0, newIndex),
                items[activeContainer][activeIndex],
                ...items[overContainer].slice(
                  newIndex,
                  items[overContainer].length,
                ),
              ],
            }
          })
        }
      }}
      onDragEnd={({ active, over }) => {
        if (active.data.current.type === 'packSection' && over?.id) {
          if (active?.id !== over?.id) {
            reorderPackSection({ activeId: active.id, targetId: over.id })
          }
        }

        const activeContainer = findContainer(active.id)

        if (!activeContainer) {
          setDragItem(null)
          return
        }

        const overId = over?.id

        if (!overId) {
          setDragItem(null)
          return
        }

        const overContainer = findContainer(overId)

        if (overContainer) {
          const activeIndex = items[activeContainer].indexOf(active.id)
          const overIndex = items[overContainer].indexOf(overId)

          // okay, so right now what we want to do is update the
          // rank attribute of our gear such that it will appear
          // at the overIndex

          if (activeIndex !== overIndex) {
            setItems((items) => ({
              ...items,
              [overContainer]: arrayMove(
                items[overContainer],
                activeIndex,
                overIndex,
              ),
            }))
          }
        }

        setDragItem(null)
      }}
      cancelDrop={cancelDrop}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        style={{
          display: 'grid',
          boxSizing: 'border-box',
          gap: 16,
          gridAutoFlow: 'row',
        }}
      >
        <SortableContext
          items={containers}
          strategy={verticalListSortingStrategy}
        >
          {packSections.map((ps) => (
            <DroppableContainer
              key={ps.id}
              id={'' + ps.id}
              label={ps.name + ' - ' + ps.rank}
              columns={columns}
              items={items[ps.id]}
              scrollable={scrollable}
              style={containerStyle}
              onRemove={() => handleRemove(ps)}
            >
              <SortableContext items={items[ps.id]} strategy={strategy}>
                {items[ps.id].map((value, index) => {
                  return (
                    <SortableItem
                      disabled={isSortingPackSection}
                      key={value}
                      id={value}
                      index={index}
                      handle={handle}
                      style={getItemStyles}
                      wrapperStyle={wrapperStyle}
                      renderItem={renderItem}
                      containerId={ps.id + ''}
                      getIndex={getIndex}
                    />
                  )
                })}
              </SortableContext>
            </DroppableContainer>
          ))}
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
          {isSortingPackSection && renderContainerDragOverlay(dragItem.id)}
          {isSortingGear && renderSortableItemDragOverlay(dragItem.id)}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )

  function renderSortableItemDragOverlay(id) {
    return (
      <Item
        value={id}
        handle={handle}
        style={getItemStyles({
          containerId: findContainer(id),
          overIndex: -1,
          index: getIndex(id),
          value: id,
          isSorting: true,
          isDragging: true,
          isDragOverlay: true,
        })}
        color={getColor(id)}
        wrapperStyle={wrapperStyle({ index: 0 })}
        renderItem={renderItem}
        dragOverlay
      />
    )
  }

  function renderContainerDragOverlay(packSectionId) {
    return (
      <Container
        label={packSections.find((ps) => ps.id === +packSectionId).name}
        columns={columns}
        style={{
          height: '100%',
        }}
        shadow
        unstyled={false}
      >
        {items[packSectionId].map((item, index) => (
          <Item
            key={item}
            value={item}
            handle={handle}
            style={getItemStyles({
              packSectionId,
              overIndex: -1,
              index: getIndex(item),
              value: item,
              isDragging: false,
              isSorting: false,
              isDragOverlay: false,
            })}
            color={getColor(item)}
            wrapperStyle={wrapperStyle({ index })}
            renderItem={renderItem}
          />
        ))}
      </Container>
    )
  }

  function handleRemove(containerID) {}
}

function getColor(id) {
  switch (id[0]) {
    case 'A':
      return '#7193f1'
    case 'B':
      return '#ffda6c'
    case 'C':
      return '#00bcd4'
    case 'D':
      return '#ef769f'
    default:
      return null
  }

  return undefined
}

function SortableItem({
  disabled,
  id,
  index,
  handle,
  renderItem,
  style,
  containerId,
  getIndex,
  wrapperStyle,
}) {
  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    over,
    overIndex,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      type: 'gear',
      // would be nice to pass the full "gear" object here!
    },
  })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      index={index}
      wrapperStyle={wrapperStyle({ index })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      color={getColor(id)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
    />
  )
}

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}

const animateLayoutChanges = (args) =>
  args.isSorting || args.wasDragging ? defaultAnimateLayoutChanges(args) : true

function DroppableContainer({
  children,
  columns = 1,
  disabled,
  id,
  items,
  style,
  ...props
}) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id,
    data: {
      type: 'packSection',
    },
    animateLayoutChanges,
  })

  const userIsDraggingItemOverThisSection =
    id === over?.id && active?.data?.current?.type !== 'packSection'
  const userIsDraggingItemOverAChildOfThisSection = items.includes(over?.id)

  const isOverContainer =
    userIsDraggingItemOverThisSection ||
    userIsDraggingItemOverAChildOfThisSection

  return (
    <Container
      ref={disabled ? undefined : setNodeRef}
      style={{
        ...style,
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      hover={isOverContainer}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      columns={columns}
      {...props}
    >
      {children}
    </Container>
  )
}
