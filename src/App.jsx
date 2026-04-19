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
  const [collapseSignal, setCollapseSignal] = useState(null) // { token, ids }

  const { items, addItem, editItem, toggleItem, deleteItem, clearAll, clearChecked } = useItems()

  async function handleClearChecked() {
    // Determine sections that will be empty after clearing (all items are checked)
    const counts = {}
    for (const it of items) {
      const c = counts[it.sectionId] ||= { checked: 0, unchecked: 0 }
      c[it.checked ? 'checked' : 'unchecked']++
    }
    const ids = Object.entries(counts)
      .filter(([, c]) => c.checked > 0 && c.unchecked === 0)
      .map(([id]) => id)
    await clearChecked()
    if (ids.length) setCollapseSignal({ token: Date.now(), ids })
  }

  async function handleClearAll() {
    const ids = [...new Set(items.map(it => it.sectionId))]
    await clearAll()
    if (ids.length) setCollapseSignal({ token: Date.now(), ids })
  }
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
        <Header onSettingsClick={() => setView('settings')} onClearAll={handleClearAll} onClearChecked={handleClearChecked} />
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
        collapseSignal={collapseSignal}
      />
    </div>
  )
}
