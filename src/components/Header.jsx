import { useState, useRef, useEffect } from 'react'

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
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Shopping List
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            aria-label="Settings"
            onClick={onSettingsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px' }}
          >
            ⚙
          </button>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              aria-label="More options"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px' }}
            >
              ⋯
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%',
                background: 'var(--white)', border: '1px solid var(--grey-mid)',
                borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                minWidth: '160px', zIndex: 200,
              }}>
                <button
                  onClick={handleClearAll}
                  style={{
                    display: 'block', width: '100%', padding: '14px 16px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', fontSize: '15px',
                  }}
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {confirmClear && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', zIndex: 500,
        }}>
          <div style={{
            background: 'var(--white)', width: '100%', padding: '24px 16px 32px',
            borderRadius: '16px 16px 0 0',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Clear all items?</h2>
            <p style={{ color: 'var(--grey-text)', marginBottom: '24px' }}>This cannot be undone.</p>
            <button
              onClick={handleConfirm}
              style={{
                display: 'block', width: '100%', padding: '16px',
                background: 'var(--black)', color: 'var(--white)',
                border: 'none', borderRadius: '8px', fontSize: '16px',
                fontWeight: 600, cursor: 'pointer', marginBottom: '12px',
              }}
            >
              Clear All
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              style={{
                display: 'block', width: '100%', padding: '16px',
                background: 'none', color: 'var(--black)',
                border: '1px solid var(--grey-mid)', borderRadius: '8px',
                fontSize: '16px', cursor: 'pointer',
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
