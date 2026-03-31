import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import ItemRow from './ItemRow'
import AddItemInput from './AddItemInput'

export default function Section({ section, items, suggestions, onAdd, onToggle, onDelete }) {
  const [expanded, setExpanded] = useState(items.length > 0)

  return (
    <div style={{ borderBottom: '1px solid var(--grey-mid)' }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '15px 16px 11px',
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
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
          display: 'flex',
          alignItems: 'center',
        }}>
          <IconChevronDown size={18} stroke={1.5} />
        </span>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 12px' }}>
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
