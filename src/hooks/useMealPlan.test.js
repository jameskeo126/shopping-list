import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMealPlan } from './useMealPlan'

const batch = vi.hoisted(() => ({
  update: vi.fn(),
  delete: vi.fn(),
  commit: vi.fn(() => Promise.resolve()),
}))

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, name) => name),
  onSnapshot: vi.fn((ref, cb) => {
    cb({
      docs: ref === 'mealPlan'
        ? [
            { id: 'm1', data: () => ({ name: 'Chilli', slot: 'saturday' }) },
            { id: 'm2', data: () => ({ name: 'Curry', slot: 'sunday' }) },
            { id: 'm3', data: () => ({ name: 'Porridge', slot: 'breakfast' }) },
          ]
        : [
            { id: 'chilli', data: () => ({ name: 'Chilli' }) },
            { id: 'chilli-2', data: () => ({ name: 'Chilli' }) },
          ],
    })
    return vi.fn()
  }),
  addDoc: vi.fn(() => Promise.resolve({ id: 'new1' })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  doc: vi.fn((db, col, id) => `${col}/${id}`),
  writeBatch: vi.fn(() => batch),
  Timestamp: { now: vi.fn(() => ({ toMillis: () => 0 })) },
}))
vi.mock('../firebase', () => ({ db: {} }))

describe('useMealPlan', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns meals and de-duplicated meal history', () => {
    const { result } = renderHook(() => useMealPlan())
    expect(result.current.meals).toHaveLength(3)
    expect(result.current.mealHistory).toEqual(['Chilli'])
  })

  it('addMeal writes the entry and remembers it', async () => {
    const { addDoc, setDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.addMeal(' Fish pie ', 'tuesday'))
    expect(addDoc).toHaveBeenCalledWith(
      'mealPlan',
      expect.objectContaining({ name: 'Fish pie', slot: 'tuesday' })
    )
    expect(setDoc).toHaveBeenCalledWith('mealHistory/fish-pie', { name: 'Fish pie' })
  })

  it('addMeal ignores blank names', async () => {
    const { addDoc, setDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.addMeal('   ', 'lunch'))
    expect(addDoc).not.toHaveBeenCalled()
    expect(setDoc).not.toHaveBeenCalled()
  })

  it('addMeal still saves a name that has no usable history id', async () => {
    const { addDoc, setDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.addMeal('寿司', 'lunch'))
    expect(addDoc).toHaveBeenCalled()
    expect(setDoc).not.toHaveBeenCalled()
  })

  it('editMeal updates the entry and remembers the new name', async () => {
    const { updateDoc, setDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.editMeal('m1', 'Veggie chilli'))
    expect(updateDoc).toHaveBeenCalledWith('mealPlan/m1', { name: 'Veggie chilli' })
    expect(setDoc).toHaveBeenCalledWith('mealHistory/veggie-chilli', { name: 'Veggie chilli' })
  })

  it('deleteMeal removes the entry', async () => {
    const { deleteDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.deleteMeal('m1'))
    expect(deleteDoc).toHaveBeenCalledWith('mealPlan/m1')
  })

  it('clearWeek deletes every entry and leaves meal history alone', async () => {
    const { setDoc, deleteDoc } = await import('firebase/firestore')
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.clearWeek())
    expect(batch.delete).toHaveBeenCalledTimes(3)
    expect(batch.commit).toHaveBeenCalledTimes(1)
    expect(setDoc).not.toHaveBeenCalled()
    expect(deleteDoc).not.toHaveBeenCalled()
  })

  it('moveDinner to an empty day updates only that dinner', async () => {
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.moveDinner('m1', 'friday'))
    expect(batch.update).toHaveBeenCalledTimes(1)
    expect(batch.update).toHaveBeenCalledWith('mealPlan/m1', { slot: 'friday' })
    expect(batch.commit).toHaveBeenCalledTimes(1)
  })

  it('moveDinner onto an occupied day swaps the two in one batch', async () => {
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.moveDinner('m1', 'sunday'))
    expect(batch.update).toHaveBeenCalledWith('mealPlan/m1', { slot: 'sunday' })
    expect(batch.update).toHaveBeenCalledWith('mealPlan/m2', { slot: 'saturday' })
    expect(batch.commit).toHaveBeenCalledTimes(1)
  })

  it('moveDinner to the same day writes nothing', async () => {
    const { result } = renderHook(() => useMealPlan())
    await act(() => result.current.moveDinner('m1', 'saturday'))
    expect(batch.update).not.toHaveBeenCalled()
    expect(batch.commit).not.toHaveBeenCalled()
  })
})
