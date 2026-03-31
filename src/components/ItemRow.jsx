import { useState, useEffect } from 'react'

export default function ItemRow({ item, onToggle, onDelete }) {
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (!showDelete) return
    function handleClick(e) {
      if (!e.target.closest('[data-item-row]')) setShowDelete(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [showDelete])

  function handleRowClick(e) {
    if (e.target.closest('[role="checkbox"]') || e.target.closest('[aria-label="Delete item"]')) return
    setShowDelete(v => !v)
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
          width: '20px',
          height: '20px',
          borderRadius: '4px',
          border: item.checked ? 'none' : '1.5px solid var(--grey-mid)',
          background: item.checked ? 'var(--black)' : 'transparent',
          flexShrink: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item.checked && <span style={{ color: 'white', fontSize: '12px', lineHeight: 1 }}>✓</span>}
      </div>

      <span style={{
        flex: 1,
        fontSize: '15px',
        color: item.checked ? 'var(--grey-text)' : 'var(--black)',
        textDecoration: item.checked ? 'line-through' : 'none',
      }}>
        {item.name}
      </span>

      {showDelete && (
        <button
          aria-label="Delete item"
          onClick={() => onDelete(item.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--grey-text)',
            fontSize: '20px',
            padding: '0 4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
