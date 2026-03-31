import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { SECTIONS } from '../data/sections'

export async function seedSectionsIfNeeded() {
  const snapshot = await getDocs(collection(db, 'sections'))
  if (snapshot.docs.length > 0) return

  await Promise.all(
    SECTIONS.map(section =>
      setDoc(doc(db, 'sections', section.id), section)
    )
  )
}
