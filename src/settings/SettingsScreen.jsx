import { useState } from 'react'
import ShopListSettings from './ShopListSettings'
import ShopEdit from './ShopEdit'

export default function SettingsScreen({ onBack }) {
  const [editingShop, setEditingShop] = useState(null)

  if (editingShop) {
    return <ShopEdit shop={editingShop} onBack={() => setEditingShop(null)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <header style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 16px 12px', borderBottom: '1px solid var(--grey-mid)',
        position: 'sticky', top: 0, background: 'var(--white)', zIndex: 100,
      }}>
        <button
          aria-label="Back"
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', padding: '4px 8px 4px 0' }}
        >
          ←
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>Settings</h1>
      </header>

      <div style={{ padding: '24px 16px' }}>
        <h2 style={{
          fontSize: '13px', fontWeight: 700, letterSpacing: '0.8px',
          textTransform: 'uppercase', color: 'var(--grey-text)', marginBottom: '12px',
        }}>
          Shops
        </h2>
        <ShopListSettings onEditShop={setEditingShop} />
      </div>
    </div>
  )
}
