import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHistory } from './useHistory'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn((ref, cb) => {
    cb({ docs: [
      { id: '1', data: () => ({ name: 'Milk' }) },
      { id: '2', data: () => ({ name: 'Eggs' }) },
      { id: '3', data: () => ({ name: 'Milk' }) }, // duplicate — should be deduped
    ]})
    return vi.fn()
  }),
}))
vi.mock('../firebase', () => ({ db: {} }))

describe('useHistory', () => {
  it('returns array of unique suggestion strings', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current).toEqual(['Milk', 'Eggs'])
  })
})
