import { describe, it, expect } from 'vitest'
import { SECTIONS } from './sections'

describe('sections', () => {
  it('exports exactly 18 sections', () => {
    expect(SECTIONS).toHaveLength(18)
  })
  it('each section has id, name, defaultOrder', () => {
    SECTIONS.forEach(s => {
      expect(s).toHaveProperty('id')
      expect(s).toHaveProperty('name')
      expect(s).toHaveProperty('defaultOrder')
    })
  })
  it('defaultOrder values are unique and 1-18', () => {
    const orders = SECTIONS.map(s => s.defaultOrder).sort((a, b) => a - b)
    expect(orders).toEqual([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])
  })
})
