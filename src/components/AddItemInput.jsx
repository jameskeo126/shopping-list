import { useState, useRef, useEffect } from 'react'
import { IconPlus } from '@tabler/icons-react'

export default function AddItemInput({ onAdd, suggestions }) {
  const [active, setActive] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  // Guards against the iOS Enter→blur sequence committing twice, and against
  // Escape leaving a pending blur that would re-commit on unmount.
  const isCommittingRef = useRef(false)

  const filtered = value.trim().length > 0
    ? suggestions
        .filter(s =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          s.toLowerCase() !== value.toLowerCase()
        )
        .slice(0, 6)
    : []

  // Reset the guard and focus the input every time we enter the active state.
  useEffect(() => {
    if (active) {
      isCommittingRef.current = false
      inputRef.current?.focus()
    }
  }, [active])

  function close() {
    // Block any pending blur from re-firing commit while we tear down.
    isCommittingRef.current = true
    setActive(false)
    setValue('')
  }

  function commit(name) {
    if (isCommittingRef.current) return
    const trimmed = name.trim()
    if (trimmed) onAdd(trimmed)
    close()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commit(value)
    else if (e.key === 'Escape') close()
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
          gap: '12px',
          fontFamily: 'var(--font-body)',
          width: '100%',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '21px', flexShrink: 0 }}>
          <IconPlus size={15} stroke={1.5} />
        </span>
        Add item
      </button>
    )
  }

  return (
    <div>
      {/* Pending-add row — visually matches ItemRow's unchecked state */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid var(--grey-light)',
      }}>
        {/* Visual-only checkbox — not interactive, no aria role */}
        <div
          aria-hidden="true"
          style={{
            width: '21px',
            height: '21px',
            borderRadius: '5px',
            border: '1.5px solid var(--grey-mid)',
            background: 'transparent',
            flexShrink: 0,
          }}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commit(value)}
          enterKeyHint="done"
          placeholder="Item name…"
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
      </div>

      {/* Inline suggestion chip strip — only when matches exist. Lives in
          normal document flow so the section's overflow:hidden wrapper
          accommodates it instead of clipping it. */}
      {filtered.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '8px 0 4px',
          scrollbarWidth: 'none',
        }}>
          {filtered.map(s => (
            <button
              key={s}
              // onMouseDown + preventDefault matches the codebase convention
              // (see existing suggestion handler and ItemRow's delete button).
              // It fires before the input's blur, so the chip's text commits
              // instead of the partial typed text.
              onMouseDown={e => { e.preventDefault(); commit(s) }}
              style={{
                flexShrink: 0,
                background: 'var(--grey-light)',
                border: 'none',
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                color: 'var(--black)',
                cursor: 'pointer',
                maxWidth: '160px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
