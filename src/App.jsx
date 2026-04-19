import { useState, useEffect } from 'react'
import { SECTIONS } from './data/sections'
import { seedSectionsIfNeeded } from './hooks/seedSections'
import { useItems } from './hooks/useItems'
import { useShops } from './hooks/useShops'
import { useHistory } from './hooks/useHistory'
import Header from './components/Header'
import ShopSelector from './components/ShopSelector'
import SectionList from './components/SectionList'
import SettingsScreen from './settings/SettingsScreen'

export default function App() {
  const [view, setView] = useState('list') // 'list' | 'settings'
  const [selectedShopId, setSelectedShopId] = useState(null)

  const { items, addItem, editItem, toggleItem, deleteItem, clearAll, clearChecked } = useItems()
  const shops = useShops()
  const history = useHistory()

  useEffect(() => { seedSectionsIfNeeded() }, [])

  // Auto-select first shop on load
  useEffect(() => {
    if (shops.length > 0 && !selectedShopId) {
      setSelectedShopId(shops[0].id)
    }
  }, [shops, selectedShopId])

  const selectedShop = shops.find(s => s.id === selectedShopId) || null

  if (view === 'settings') {
    return <SettingsScreen onBack={() => setView('list')} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--white)',
        margin: '0 -16px',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <Header onSettingsClick={() => setView('settings')} onClearAll={clearAll} onClearChecked={clearChecked} />
        <ShopSelector
          shops={shops}
          selectedShopId={selectedShopId}
          onSelect={setSelectedShopId}
          onAddShop={() => setView('settings')}
        />
      </div>
      <SectionList
        sections={SECTIONS}
        items={items}
        shop={selectedShop}
        suggestions={history}
        onAdd={addItem}
        onEdit={editItem}
        onToggle={toggleItem}
        onDelete={deleteItem}
      />
    </div>
  )
}
