import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useHistory() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'history'), snapshot => {
      const names = [...new Set(snapshot.docs.map(d => d.data().name))]
      setHistory(names)
    })
    return unsub
  }, [])

  return history
}
