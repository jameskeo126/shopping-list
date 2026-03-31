import { useState, useRef, useEffect } from 'react'
import { IconPlus } from '@tabler/icons-react'

export default function AddItemInput({ onAdd, suggestions }) {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const filtered = value.trim().length > 0
    ? suggestions.filter(s =>
        s.toLowerCase().includes(value.toLowerCase()) &&
        s.toLowerCase() !== value.toLowerCase()
      )
    : []

  useEffect(() => {
    if (active && inputRef.current) inputRef.current.focus()
  }, [active])

  function handleAdd(name) {
    if (!name.trim()) { setActive(false); return }
    onAdd(name.trim())
    setValue('')
    setActive(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter')  handleAdd(value)
    if (e.key === 'Escape') { setActive(false); setValue('') }
  }

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--grey-text)',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '10px 0',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-body)',
        }}
      >
        <IconPlus size={15} stroke={1.5} />
        Add item
      </button>
    )
  }

  return (
    <div style={{ position: 'relative', paddingTop: '8px' }}>
      <input
        ref={inputRef}
        role="textbox"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (!value.trim()) setActive(false) }}
        placeholder="Item name…"
        style={{
          width: '100%',
          border: 'none',
          outline: 'none',
          fontSize: '16px',
          padding: '4px 0',
          background: 'transparent',
          fontFamily: 'var(--font-body)',
        }}
      />
      {filtered.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--white)',
          border: '1px solid var(--grey-mid)',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          zIndex: 300,
          overflow: 'hidden',
        }}>
          {filtered.slice(0, 6).map(s => (
            <button
              key={s}
              onMouseDown={e => { e.preventDefault(); handleAdd(s) }}
              style={{
                display: 'block', width: '100%', padding: '12px 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: '15px',
                borderBottom: '1px solid var(--grey-light)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
