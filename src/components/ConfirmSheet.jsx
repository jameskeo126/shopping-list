export default function ConfirmSheet({ title, confirmLabel, onConfirm, onCancel }) {
  return (
    <div
      onClick={onCancel}
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
          {title}
        </h2>
        <p style={{ color: 'var(--grey-text)', marginBottom: '24px', fontSize: '15px' }}>
          This cannot be undone.
        </p>
        <button
          onClick={onConfirm}
          style={{
            display: 'block', width: '100%', padding: '16px',
            background: 'var(--black)', color: 'var(--white)',
            border: 'none', borderRadius: '10px', fontSize: '16px',
            fontWeight: 600, cursor: 'pointer', marginBottom: '10px',
            fontFamily: 'var(--font-body)',
          }}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onCancel}
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
  )
}
