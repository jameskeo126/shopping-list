import { useState } from 'react'
import { IconArrowLeft } from '@tabler/icons-react'
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 0', display: 'flex', alignItems: 'center', color: 'var(--grey-icon)' }}
        >
          <IconArrowLeft size={22} stroke={1.5} />
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-head)', letterSpacing: '-0.3px' }}>Shops</h1>
      </header>

      <div style={{ padding: '24px 16px' }}>
        <ShopListSettings onEditShop={setEditingShop} />
      </div>
    </div>
  )
}
