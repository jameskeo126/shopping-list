import { useState, useRef, useEffect } from 'react'
import { IconMapPin, IconDots, IconTrash } from '@tabler/icons-react'

export default function Header({ onSettingsClick, onClearAll }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  function handleClearAll() {
    setMenuOpen(false)
    setConfirmClear(true)
  }

  function handleConfirm() {
    setConfirmClear(false)
    onClearAll()
  }

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 16px 12px',
        borderBottom: '1px solid var(--grey-mid)',
        position: 'sticky',
        top: 0,
        background: 'var(--white)',
        zIndex: 100,
      }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 700,
          fontFamily: 'var(--font-head)',
          letterSpacing: '-0.3px',
        }}>
          Shopping List
        </h1>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            aria-label="Settings"
            onClick={onSettingsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
          >
            <IconMapPin size={22} stroke={1.5} />
          </button>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              aria-label="More options"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
            >
              <IconDots size={22} stroke={1.5} />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%',
                background: 'var(--white)', border: '1px solid var(--grey-mid)',
                borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                minWidth: '170px', zIndex: 200, overflow: 'hidden',
              }}>
                <button
                  onClick={handleClearAll}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '13px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', fontSize: '15px', color: 'var(--black)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <IconTrash size={17} stroke={1.5} color="var(--grey-icon)" />
                  Clear all items
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {confirmClear && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'flex-end', zIndex: 500,
        }}>
          <div style={{
            background: 'var(--white)', width: '100%', padding: '24px 16px 32px',
            borderRadius: '20px 20px 0 0',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-head)', marginBottom: '6px' }}>
              Clear all items?
            </h2>
            <p style={{ color: 'var(--grey-text)', marginBottom: '24px', fontSize: '15px' }}>
              This cannot be undone.
            </p>
            <button
              onClick={handleConfirm}
              style={{
                display: 'block', width: '100%', padding: '16px',
                background: 'var(--black)', color: 'var(--white)',
                border: 'none', borderRadius: '10px', fontSize: '16px',
                fontWeight: 600, cursor: 'pointer', marginBottom: '10px',
                fontFamily: 'var(--font-body)',
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              style={{
                display: 'block', width: '100%', padding: '16px',
                background: 'none', color: 'var(--black)',
                border: '1px solid var(--grey-mid)', borderRadius: '10px',
                fontSize: '16px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
