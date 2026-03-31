import { useState } from 'react'
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
          padding: '16px 16px 12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.2px' }}>
          {section.name}
        </span>
        <span style={{
          fontSize: '12px',
          color: 'var(--grey-text)',
          transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
          display: 'inline-block',
        }}>
          ▾
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
