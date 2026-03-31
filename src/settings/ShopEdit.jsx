import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { SECTIONS } from '../data/sections'
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
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid var(--grey-light)',
        background: isDragging ? 'var(--grey-light)' : 'transparent',
        borderRadius: isDragging ? '6px' : 0,
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      <span style={{ flex: 1, fontSize: '15px' }}>{name}</span>
      <span
        {...attributes}
        {...listeners}
        style={{
          color: 'var(--grey-text)', fontSize: '20px', padding: '0 4px',
          touchAction: 'none', cursor: 'grab',
        }}
      >
        ⠿
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
        padding: '20px 16px 12px', borderBottom: '1px solid var(--grey-mid)',
        position: 'sticky', top: 0, background: 'var(--white)', zIndex: 100,
      }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px 4px 0' }}
        >
          ←
        </button>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={handleNameBlur}
          style={{
            flex: 1, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px',
            border: 'none', outline: 'none', background: 'transparent',
          }}
        />
      </header>

      <div style={{ padding: '16px 16px 32px' }}>
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
