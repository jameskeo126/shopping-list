import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export function useShops() {
  const [shops, setShops] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'shops'), snapshot => {
      setShops(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  return shops
}
