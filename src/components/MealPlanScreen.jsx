import { useEffect, useState } from 'react'
import {
  DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors,
} from '@dnd-kit/core'
import { IconArrowLeft, IconClipboardX, IconGripVertical } from '@tabler/icons-react'
import { DINNER_DAYS } from '../data/mealSlots'
import { useMealPlan } from '../hooks/useMealPlan'
import AddItemInput from './AddItemInput'
import ConfirmSheet from './ConfirmSheet'
import ItemRow from './ItemRow'

const headingStyle = {
  fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-head)',
  letterSpacing: '-0.2px', marginBottom: '4px',
}
const dayStyle = {
  fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-head)',
  letterSpacing: '-0.1px', paddingTop: '12px',
}

function MealSection({ title, slot, meals, suggestions, onAdd, onEdit, onDelete }) {
  return (
    <section>
      <h2 style={headingStyle}>{title}</h2>
      {meals.filter(meal => meal.slot === slot).map(meal => (
        <ItemRow key={meal.id} item={meal} showCheckbox={false} onEdit={onEdit} onDelete={onDelete} />
      ))}
      <AddItemInput showCheckbox={false} onAdd={name => onAdd(name, slot)} suggestions={suggestions} />
    </section>
  )
}

function DinnerEntry({ meal, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: meal.id })
  const dragStyle = transform && {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'relative',
    zIndex: 10,
    background: 'var(--white)',
  }

  return (
    <div ref={setNodeRef} style={dragStyle || undefined}>
      <ItemRow
        item={meal}
        showCheckbox={false}
        onEdit={onEdit}
        onDelete={onDelete}
        trailing={
          <button
            {...attributes}
            {...listeners}
            data-no-edit=""
            aria-label="Move dinner"
            style={{
              background: 'none', border: 'none', cursor: 'grab', padding: '2px 4px',
              display: 'flex', alignItems: 'center', color: 'var(--grey-icon)',
              touchAction: 'none',
            }}
          >
            <IconGripVertical size={18} stroke={1.5} />
          </button>
        }
      />
    </div>
  )
}

function DinnerDay({ day, dinners, suggestions, onAdd, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: day.id })

  return (
    <div
      ref={setNodeRef}
      style={{ background: isOver ? 'var(--grey-light)' : 'transparent', borderRadius: '8px' }}
    >
      <h3 style={dayStyle}>{day.name}</h3>
      {dinners.map(meal => (
        <DinnerEntry key={meal.id} meal={meal} onEdit={onEdit} onDelete={onDelete} />
      ))}
      {dinners.length === 0 && (
        <AddItemInput showCheckbox={false} onAdd={name => onAdd(name, day.id)} suggestions={suggestions} />
      )}
    </div>
  )
}

export default function MealPlanScreen({ onBack }) {
  const { meals, mealHistory, addMeal, editMeal, deleteMeal, clearWeek, moveDinner } = useMealPlan()
  const [confirmingClear, setConfirmingClear] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const sectionProps = {
    meals, suggestions: mealHistory, onAdd: addMeal, onEdit: editMeal, onDelete: deleteMeal,
  }

  function handleDragEnd({ active, over }) {
    if (over) moveDinner(active.id, over.id)
  }

  function handleClearWeek() {
    clearWeek()
    setConfirmingClear(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        paddingTop: 'calc(env(safe-area-inset-top, 20px) + 12px)',
        paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px',
        margin: '0 -16px',
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
        <h1 style={{ flex: 1, fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-head)', letterSpacing: '-0.3px' }}>
          Meal Plan
        </h1>
        <button
          aria-label="Clear week"
          onClick={() => setConfirmingClear(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: '#c0504d' }}
        >
          <IconClipboardX size={22} stroke={1.5} />
        </button>
      </header>

      <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <MealSection title="Breakfast" slot="breakfast" {...sectionProps} />
        <MealSection title="Lunches" slot="lunch" {...sectionProps} />
        <section>
          <h2 style={headingStyle}>Dinners</h2>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {DINNER_DAYS.map(day => (
              <DinnerDay
                key={day.id}
                day={day}
                dinners={meals.filter(meal => meal.slot === day.id)}
                suggestions={mealHistory}
                onAdd={addMeal}
                onEdit={editMeal}
                onDelete={deleteMeal}
              />
            ))}
          </DndContext>
        </section>
      </div>

      {confirmingClear && (
        <ConfirmSheet
          title="Clear this week?"
          confirmLabel="Clear Week"
          onConfirm={handleClearWeek}
          onCancel={() => setConfirmingClear(false)}
        />
      )}
    </div>
  )
}
