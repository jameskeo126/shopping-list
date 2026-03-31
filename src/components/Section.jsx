import { useState, useRef, useEffect } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { SECTION_ICONS } from '../data/sectionIcons'
import ItemRow from './ItemRow'
import AddItemInput from './AddItemInput'

export default function Section({ section, items, suggestions, onAdd, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(items.length > 0)
  const didInitRef = useRef(false)

  // Firestore data loads async — open the section the first time items arrive
  useEffect(() => {
    if (!didInitRef.current && items.length > 0) {
      didInitRef.current = true
      setExpanded(true)
    }
  }, [items.length])

  const SectionIcon = SECTION_ICONS[section.id]

  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '10px',
          color: 'var(--black)',
        }}
      >
        {SectionIcon && (
          <span style={{ color: 'var(--grey-icon)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <SectionIcon size={18} stroke={1.5} />
          </span>
        )}
        <span style={{
          flex: 1,
          fontWeight: 600,
          fontSize: '15px',
          fontFamily: 'var(--font-head)',
          letterSpacing: '-0.1px',
        }}>
          {section.name}
        </span>
        <span style={{
          color: 'var(--grey-icon)',
          transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <IconPlus size={18} stroke={1.5} />
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px' }}>
          {items.map(item => (
            <ItemRow key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
          ))}
          <AddItemInput
            onAdd={name => onAdd(name, section.id)}
            suggestions={suggestions || []}
          />
        </div>
      )}
    </div>
  )
}
