import { useState, useRef, useEffect } from 'react'
import { IconX, IconCheck } from '@tabler/icons-react'

export default function ItemRow({ item, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.name)
  const inputRef = useRef(null)

  // Sync editValue if item name changes externally
  useEffect(() => {
    if (!editing) setEditValue(item.name)
  }, [item.name, editing])

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function handleRowClick(e) {
    if (e.target.closest('[role="checkbox"]') || e.target.closest('[aria-label="Delete item"]')) return
    if (!editing) {
      setEditValue(item.name)
      setEditing(true)
    }
  }

  function handleSave() {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== item.name) {
      onEdit(item.id, trimmed)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  handleSave()
    if (e.key === 'Escape') { setEditing(false); setEditValue(item.name) }
  }

  return (
    <div
      data-item-row=""
      onClick={handleRowClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid var(--grey-light)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      <div
        role="checkbox"
        aria-checked={item.checked}
        onClick={() => onToggle(item.id, item.checked)}
        style={{
          width: '21px',
          height: '21px',
          borderRadius: '5px',
          border: item.checked ? 'none' : '1.5px solid var(--grey-mid)',
          background: item.checked ? 'var(--black)' : 'transparent',
          flexShrink: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.checked && <IconCheck size={13} stroke={2.5} color="white" />}
      </div>

      {editing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          style={{
            flex: 1,
            fontSize: '16px',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            color: 'var(--black)',
            padding: 0,
          }}
        />
      ) : (
        <span style={{
          flex: 1,
          fontSize: '15px',
          color: item.checked ? 'var(--grey-text)' : 'var(--black)',
          textDecoration: item.checked ? 'line-through' : 'none',
        }}>
          {item.name}
        </span>
      )}

      {editing && (
        <button
          aria-label="Delete item"
          onMouseDown={e => e.preventDefault()} // prevent input blur before click fires
          onClick={() => onDelete(item.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--grey-icon)',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconX size={18} stroke={1.5} />
        </button>
      )}
    </div>
  )
}
