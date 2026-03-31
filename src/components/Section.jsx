import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import ItemRow from './ItemRow'
import AddItemInput from './AddItemInput'

export default function Section({ section, items, suggestions, onAdd, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(items.length > 0)

  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
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
