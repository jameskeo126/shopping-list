import { useState } from 'react'
import { IconMapPin, IconClipboardX } from '@tabler/icons-react'

export default function Header({ onSettingsClick, onClearAll }) {
  const [confirmClear, setConfirmClear] = useState(false)

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
        margin: '0 -16px',
        borderBottom: '1px solid var(--grey-mid)',
        background: 'var(--white)',
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
            aria-label="Settings"
            onClick={onSettingsClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
          >
            <IconMapPin size={22} stroke={1.5} />
          </button>
          <button
            aria-label="Clear all items"
            onClick={() => setConfirmClear(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: '#c0504d' }}
          >
            <IconClipboardX size={22} stroke={1.5} />
          </button>
        </div>
      </header>

      {confirmClear && (
        <div
          onClick={() => setConfirmClear(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', zIndex: 500,
            alignItems: window.innerWidth >= 480 ? 'center' : 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--white)',
              padding: '24px 16px 32px',
              ...(window.innerWidth < 480
                ? { width: '100%', borderRadius: '20px 20px 0 0' }
                : { width: '360px', borderRadius: '16px', padding: '32px 28px' }
              ),
            }}
          >
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
