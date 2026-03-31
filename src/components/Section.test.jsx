import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Section from './Section'

const section = { id: 'fruit-veg', name: 'Fruit & Veg', defaultOrder: 1 }
const items = [
  { id: 'i1', name: 'Apples',  sectionId: 'fruit-veg', checked: false },
  { id: 'i2', name: 'Bananas', sectionId: 'fruit-veg', checked: true  },
]

describe('Section', () => {
  it('renders section name', () => {
    render(<Section section={section} items={items} onAdd={vi.fn()} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Fruit & Veg')).toBeInTheDocument()
  })

  it('expands by default when items exist', () => {
    render(<Section section={section} items={items} onAdd={vi.fn()} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Apples')).toBeInTheDocument()
  })

  it('collapses by default when no items', () => {
    render(<Section section={section} items={[]} onAdd={vi.fn()} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('+ Add item')).not.toBeInTheDocument()
  })

  it('toggles collapse when header is clicked', () => {
    render(<Section section={section} items={items} onAdd={vi.fn()} onToggle={vi.fn()} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Fruit & Veg'))
    expect(screen.queryByText('Apples')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Fruit & Veg'))
    expect(screen.getByText('Apples')).toBeInTheDocument()
  })
})
