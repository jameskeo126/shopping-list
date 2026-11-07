import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, setDoc, writeBatch, Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

function saveToMealHistory(name) {
  const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  if (!id) return Promise.resolve()
  return setDoc(doc(db, 'mealHistory', id), { name }).catch(() => {})
}

export function useMealPlan() {
  const [meals, setMeals] = useState([])
  const [mealHistory, setMealHistory] = useState([])

  useEffect(() => {
    const unsubMeals = onSnapshot(collection(db, 'mealPlan'), snapshot => {
      setMeals(
        snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0))
      )
    })
    const unsubHistory = onSnapshot(collection(db, 'mealHistory'), snapshot => {
      setMealHistory([...new Set(snapshot.docs.map(d => d.data().name))])
    })
    return () => { unsubMeals(); unsubHistory() }
  }, [])

  async function addMeal(name, slot) {
    const trimmed = name.trim()
    if (!trimmed) return
    await addDoc(collection(db, 'mealPlan'), { name: trimmed, slot, createdAt: Timestamp.now() })
    await saveToMealHistory(trimmed)
  }

  async function editMeal(id, newName) {
    const trimmed = newName.trim()
    if (!trimmed) return
    await updateDoc(doc(db, 'mealPlan', id), { name: trimmed })
    await saveToMealHistory(trimmed)
  }

  async function deleteMeal(id) {
    await deleteDoc(doc(db, 'mealPlan', id))
  }

  async function clearWeek() {
    const batch = writeBatch(db)
    meals.forEach(meal => batch.delete(doc(db, 'mealPlan', meal.id)))
    await batch.commit()
  }

  async function moveDinner(id, toDay) {
    const moving = meals.find(m => m.id === id)
    if (!moving || moving.slot === toDay) return
    const batch = writeBatch(db)
    batch.update(doc(db, 'mealPlan', id), { slot: toDay })
    meals
      .filter(m => m.slot === toDay)
      .forEach(m => batch.update(doc(db, 'mealPlan', m.id), { slot: moving.slot }))
    await batch.commit()
  }

  return { meals, mealHistory, addMeal, editMeal, deleteMeal, clearWeek, moveDinner }
}
