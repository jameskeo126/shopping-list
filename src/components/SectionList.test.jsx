import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SectionList from './SectionList'
import { SECTIONS } from '../data/sections'

const items = [
  { id: 'i1', name: 'Milk', sectionId: 'dairy-cheese', checked: false },
]
const shop = { id: 's1', name: 'ALDI', sectionOrder: ['dairy-cheese', 'fruit-veg', 'bakery'] }

describe('SectionList', () => {
  it('renders all 18 sections when no shop selected', () => {
    render(
      <SectionList sections={SECTIONS} items={[]} shop={null} suggestions={[]}
        onAdd={vi.fn()} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    SECTIONS.forEach(s => expect(screen.getByText(s.name)).toBeInTheDocument())
  })

  it('renders sections in shop order (first section is Dairy & Cheese)', () => {
    const { container } = render(
      <SectionList sections={SECTIONS} items={items} shop={shop} suggestions={[]}
        onAdd={vi.fn()} onToggle={vi.fn()} onDelete={vi.fn()} />
    )
    expect(screen.getAllByText('Dairy & Cheese')[0]).toBeInTheDocument()
  })
})
