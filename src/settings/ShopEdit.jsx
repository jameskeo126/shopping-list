import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { SECTIONS } from '../data/sections'
import { SECTION_EXAMPLES } from '../data/sectionExamples'
import { IconArrowLeft, IconGripVertical } from '@tabler/icons-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableSection({ id, name }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const examples = SECTION_EXAMPLES[id]
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--grey-light)',
        background: isDragging ? 'var(--grey-light)' : 'transparent',
        borderRadius: isDragging ? '6px' : 0,
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: 500 }}>{name}</div>
        {examples && (
          <div style={{ fontSize: '12px', color: 'var(--grey-text)', marginTop: '2px' }}>
            {examples}
          </div>
        )}
      </div>
      <span
        {...attributes}
        {...listeners}
        style={{
          color: 'var(--grey-icon)', padding: '0 4px',
          touchAction: 'none', cursor: 'grab', display: 'flex', alignItems: 'center',
        }}
      >
        <IconGripVertical size={18} stroke={1.5} />
      </span>
    </div>
  )
}

export default function ShopEdit({ shop, onBack }) {
  const [name, setName] = useState(shop.name)
  const [order, setOrder] = useState(
    shop.sectionOrder && shop.sectionOrder.length === SECTIONS.length
      ? shop.sectionOrder
      : SECTIONS.map(s => s.id)
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIndex = order.indexOf(active.id)
    const newIndex = order.indexOf(over.id)
    const newOrder = arrayMove(order, oldIndex, newIndex)
    setOrder(newOrder)
    await updateDoc(doc(db, 'shops', shop.id), { sectionOrder: newOrder })
  }

  async function handleNameBlur() {
    if (name.trim() && name !== shop.name) {
      await updateDoc(doc(db, 'shops', shop.id), { name: name.trim() })
    }
  }

  const sectionMap = Object.fromEntries(SECTIONS.map(s => [s.id, s.name]))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 16px 12px', margin: '0 -16px',
        borderBottom: '1px solid var(--grey-mid)',
        position: 'sticky', top: 0, background: 'var(--white)', zIndex: 100,
      }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 0', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
        >
          <IconArrowLeft size={22} stroke={1.5} />
        </button>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={handleNameBlur}
          style={{
            flex: 1, fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px',
            fontFamily: 'var(--font-head)',
            border: 'none', outline: 'none', background: 'transparent',
          }}
        />
      </header>

      <div style={{ padding: '16px 0 32px' }}>
        <p style={{ fontSize: '13px', color: 'var(--grey-text)', marginBottom: '16px' }}>
          Drag sections into the order you walk this shop
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {order.map(id => (
              <SortableSection key={id} id={id} name={sectionMap[id] || id} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
