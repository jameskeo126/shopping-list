import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, setDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useItems() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'items'), snapshot => {
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
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
      createdAt: serverTimestamp(),
    })
    // Use setDoc with a deterministic doc ID so the same item name
    // never creates duplicate history entries
    const historyId = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await setDoc(doc(db, 'history', historyId), { name: trimmed }).catch(() => {
      // Ignore if history write fails — autosuggest is non-critical
    })
  }

  async function toggleItem(id, currentChecked) {
    await updateDoc(doc(db, 'items', id), { checked: !currentChecked })
  }

  async function deleteItem(id) {
    await deleteDoc(doc(db, 'items', id))
  }

  async function clearAll() {
    await Promise.all(items.map(item => deleteDoc(doc(db, 'items', item.id))))
  }

  return { items, addItem, toggleItem, deleteItem, clearAll }
}
