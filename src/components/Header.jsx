import { useState, useRef, useEffect } from 'react'
import { IconCalendarWeek, IconMapPin, IconClipboardX } from '@tabler/icons-react'
import ConfirmSheet from './ConfirmSheet'

export default function Header({ onSettingsClick, onMealPlanClick, onClearAll, onClearChecked }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirm, setConfirm] = useState(null) // 'all' | 'checked' | null
  const menuRef = useRef(null)

  // Close menu on outside tap
  useEffect(() => {
    if (!menuOpen) return
    function handleTap(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', handleTap)
    return () => document.removeEventListener('pointerdown', handleTap)
  }, [menuOpen])

  function handleConfirm() {
    if (confirm === 'all') onClearAll()
    else if (confirm === 'checked') onClearChecked()
    setConfirm(null)
  }

  const menuItemStyle = {
    display: 'block', width: '100%', padding: '12px 16px',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '15px', fontFamily: 'var(--font-body)',
    textAlign: 'left', color: 'var(--black)',
  }

  return (
    <>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '16px',
        paddingRight: '16px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 700,
          fontFamily: 'var(--font-head)',
          letterSpacing: '-0.3px',
        }}>
          Shopping List
        </h1>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            aria-label="Meal plan"
            onClick={onMealPlanClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
          >
            <IconCalendarWeek size={22} stroke={1.5} />
          </button>
          <button
            aria-label="Settings"
            onClick={onSettingsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
          >
            <IconMapPin size={22} stroke={1.5} />
          </button>
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              aria-label="Clear items"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: '#c0504d' }}
            >
              <IconClipboardX size={22} stroke={1.5} />
            </button>
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                background: 'var(--white)', borderRadius: '10px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                minWidth: '170px', overflow: 'hidden', zIndex: 200,
              }}>
                <button
                  onClick={() => { setMenuOpen(false); setConfirm('checked') }}
                  style={menuItemStyle}
                >
                  Clear Checked
                </button>
                <div style={{ height: '1px', background: 'var(--grey-mid)', margin: '0 12px' }} />
                <button
                  onClick={() => { setMenuOpen(false); setConfirm('all') }}
                  style={{ ...menuItemStyle, color: '#c0504d' }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {confirm && (
        <ConfirmSheet
          title={confirm === 'all' ? 'Clear all items?' : 'Clear checked items?'}
          confirmLabel={confirm === 'all' ? 'Clear All' : 'Clear Checked'}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  )
}
