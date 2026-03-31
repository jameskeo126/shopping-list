import { useState } from 'react'
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useShops } from '../hooks/useShops'
import { SECTIONS } from '../data/sections'
import { IconX, IconPlus } from '@tabler/icons-react'

export default function ShopListSettings({ onEditShop }) {
  const shops = useShops()
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  async function handleAdd() {
    if (!newName.trim()) return
    await addDoc(collection(db, 'shops'), {
      name: newName.trim(),
      sectionOrder: SECTIONS.map(s => s.id),
    })
    setNewName('')
    setAdding(false)
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, 'shops', id))
  }

  return (
    <div>
      {shops.map(shop => (
        <div key={shop.id} style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 0',
          borderBottom: '1px solid var(--grey-light)',
        }}>
          <span
            onClick={() => onEditShop(shop)}
            style={{ flex: 1, fontSize: '16px', cursor: 'pointer' }}
          >
            {shop.name}
          </span>
          <button
            aria-label={`Delete ${shop.name}`}
            onClick={() => handleDelete(shop.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--grey-icon)', padding: '4px 8px',
              display: 'flex', alignItems: 'center',
            }}
          >
            <IconX size={18} stroke={1.5} />
          </button>
        </div>
      ))}

      {adding ? (
        <div style={{ display: 'flex', gap: '8px', padding: '12px 0', alignItems: 'center' }}>
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd()
              if (e.key === 'Escape') { setAdding(false); setNewName('') }
            }}
            placeholder="Shop name"
            style={{
              flex: 1, border: 'none', borderBottom: '1.5px solid var(--black)',
              outline: 'none', fontSize: '16px', padding: '4px 0', background: 'transparent',
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              background: 'var(--black)', color: 'var(--white)',
              border: 'none', borderRadius: '6px', padding: '8px 16px',
              cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--grey-text)', fontSize: '14px', padding: '12px 0',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-body)',
          }}
        >
          <IconPlus size={15} stroke={1.5} />
          Add shop
        </button>
      )}
    </div>
  )
}
