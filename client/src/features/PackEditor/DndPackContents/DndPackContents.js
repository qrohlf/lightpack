import React, { useState } from 'react'
import styles from './DndPackContents.module.css'
import _ from 'lodash'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
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
import { CSS } from '@dnd-kit/utilities'
import { PackEditorSection } from '../PackEditorSection'

export const DndPackContents = ({ packQuery }) => {
  const [packSections, setPackSections] = useState(
    packQuery.data.pack.packSections,
  )
  const sortedPackSections = _.sortBy(packSections, 'rank')
  const sortedPackSectionIds = sortedPackSections.map((ps) => ps.id)

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const handleDragEnd = console.log

  return (
    <div className={styles.DndPackContents}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={console.log}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedPackSectionIds}
          strategy={verticalListSortingStrategy}
        >
          {sortedPackSections.map((ps) => (
            <DndPackSection key={ps.id} packSection={ps} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

// drag-and-drop wrapper for a PackSection
const DndPackSection = ({ packSection }) => {
  const {
    active,
    over,
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: packSection.id,
    data: {
      type: 'packSection',
    },
    // animateLayoutChanges,
  })

  isDragging && console.log(packSection.name, { isDragging, transform })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {packSection.name}
    </div>
  )

  // return (
  //   <PackEditorSection
  //     ref={setNodeRef}
  //     section={packSection}
  //     color="red"
  //     style={{
  //       transform: CSS.Translate.toString(transform),
  //       opacity: isDragging ? 0.5 : undefined,
  //     }}
  //     handleProps={{ ...attributes, ...listeners }}
  //   />
  // )
}
