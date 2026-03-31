import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useShops } from './useShops'

const unsubscribe = vi.fn()
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn((ref, cb) => {
    cb({ docs: [
      { id: 'shop1', data: () => ({ id: 'shop1', name: 'ALDI', sectionOrder: ['fruit-veg', 'bakery'] }) }
    ]})
    return unsubscribe
  }),
}))
vi.mock('../firebase', () => ({ db: {} }))

describe('useShops', () => {
  it('returns array of shops from Firestore snapshot', () => {
    const { result } = renderHook(() => useShops())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('ALDI')
  })

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useShops())
    unmount()
    expect(unsubscribe).toHaveBeenCalled()
  })
})
