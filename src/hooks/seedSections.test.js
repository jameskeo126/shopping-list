import { describe, it, expect, vi, beforeEach } from 'vitest'
import { seedSectionsIfNeeded } from './seedSections'

const mockDocs = []
const mockGetDocs = vi.fn(() => Promise.resolve({ docs: mockDocs }))
const mockSetDoc = vi.fn(() => Promise.resolve())
const mockDoc = vi.fn((db, col, id) => ({ path: `${col}/${id}` }))
const mockCollection = vi.fn()

vi.mock('firebase/firestore', () => ({
  getDocs:    (...args) => mockGetDocs(...args),
  setDoc:     (...args) => mockSetDoc(...args),
  doc:        (...args) => mockDoc(...args),
  collection: (...args) => mockCollection(...args),
}))

vi.mock('../firebase', () => ({ db: {} }))

describe('seedSectionsIfNeeded', () => {
  beforeEach(() => { mockGetDocs.mockClear(); mockSetDoc.mockClear(); mockDocs.length = 0 })

  it('seeds 18 sections when collection is empty', async () => {
    await seedSectionsIfNeeded()
    expect(mockSetDoc).toHaveBeenCalledTimes(18)
  })

  it('does nothing when sections already exist', async () => {
    mockDocs.push({ id: 'fruit-veg' })
    await seedSectionsIfNeeded()
    expect(mockSetDoc).not.toHaveBeenCalled()
  })
})
