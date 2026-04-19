import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, setDoc, Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

function saveToHistory(name) {
  const historyId = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return setDoc(doc(db, 'history', historyId), { name }).catch(() => {})
}

export function useItems() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'items'), snapshot => {
      setItems(
        snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0))
      )
    })
    return unsub
  }, [])

  async function addItem(name, sectionId) {
    const trimmed = name.trim()
    if (!trimmed) return
    await addDoc(collection(db, 'items'), {
      name: trimmed,
      sectionId,
      checked: false,
      createdAt: Timestamp.now(),
    })
    // History is NOT written here — the item may be misspelled.
    // It's written when the item is checked off or manually edited.
  }

  async function editItem(id, newName) {
    const trimmed = newName.trim()
    if (!trimmed) return
    await updateDoc(doc(db, 'items', id), { name: trimmed })
    // Confirmed correct spelling — save to history
    await saveToHistory(trimmed)
  }

  async function toggleItem(id, currentChecked) {
    await updateDoc(doc(db, 'items', id), { checked: !currentChecked })
    // Being checked off = confirmed item — save to history
    if (!currentChecked) {
      const item = items.find(i => i.id === id)
      if (item) await saveToHistory(item.name)
    }
  }

  async function deleteItem(id) {
    await deleteDoc(doc(db, 'items', id))
  }

  async function clearAll() {
    await Promise.all(items.map(item => deleteDoc(doc(db, 'items', item.id))))
  }

  async function clearChecked() {
    await Promise.all(items.filter(i => i.checked).map(item => deleteDoc(doc(db, 'items', item.id))))
  }

  return { items, addItem, editItem, toggleItem, deleteItem, clearAll, clearChecked }
}
