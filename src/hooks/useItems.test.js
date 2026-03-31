import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useItems } from './useItems'

vi.mock('firebase/firestore', () => ({
  collection:      vi.fn(() => 'mock-collection'),
  onSnapshot:      vi.fn((ref, cb) => {
    cb({ docs: [
      { id: 'item1', data: () => ({ name: 'Milk',  sectionId: 'dairy-cheese', checked: false, createdAt: 0 }) },
      { id: 'item2', data: () => ({ name: 'Eggs',  sectionId: 'dairy-cheese', checked: true,  createdAt: 1 }) },
    ]})
    return vi.fn()
  }),
  addDoc:          vi.fn(() => Promise.resolve({ id: 'new1' })),
  setDoc:          vi.fn(() => Promise.resolve()),
  updateDoc:       vi.fn(() => Promise.resolve()),
  deleteDoc:       vi.fn(() => Promise.resolve()),
  doc:             vi.fn((db, col, id) => ({ path: `${col}/${id}` })),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
}))
vi.mock('../firebase', () => ({ db: {} }))

describe('useItems', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns items from Firestore', () => {
    const { result } = renderHook(() => useItems())
    expect(result.current.items).toHaveLength(2)
  })

  it('addItem calls addDoc for the item', async () => {
    const { addDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useItems())
    await act(async () => {
      await result.current.addItem('Butter', 'dairy-cheese')
    })
    expect(addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'Butter', sectionId: 'dairy-cheese' })
    )
  })

  it('addItem writes to history using setDoc for deduplication', async () => {
    const { setDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useItems())
    await act(async () => {
      await result.current.addItem('Butter', 'dairy-cheese')
      await result.current.addItem('Butter', 'dairy-cheese')
    })
    const calls = setDoc.mock.calls.filter(c => c[1]?.name === 'Butter')
    expect(calls.length).toBeGreaterThan(0)
  })

  it('toggleItem calls updateDoc with toggled checked value', async () => {
    const { updateDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useItems())
    await act(async () => {
      await result.current.toggleItem('item1', false)
    })
    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), { checked: true })
  })

  it('deleteItem calls deleteDoc', async () => {
    const { deleteDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useItems())
    await act(async () => {
      await result.current.deleteItem('item1')
    })
    expect(deleteDoc).toHaveBeenCalled()
  })

  it('clearAll calls deleteDoc for every item', async () => {
    const { deleteDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useItems())
    await act(async () => {
      await result.current.clearAll()
    })
    expect(deleteDoc).toHaveBeenCalledTimes(2)
  })
})
