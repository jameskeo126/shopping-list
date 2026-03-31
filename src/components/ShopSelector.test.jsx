import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ShopSelector from './ShopSelector'

const shops = [
  { id: 's1', name: 'ALDI',        sectionOrder: [] },
  { id: 's2', name: "Sainsbury's", sectionOrder: [] },
]

describe('ShopSelector', () => {
  it('renders all shop names as tabs', () => {
    render(<ShopSelector shops={shops} selectedShopId="s1" onSelect={vi.fn()} onAddShop={vi.fn()} />)
    expect(screen.getByText('ALDI')).toBeInTheDocument()
    expect(screen.getByText("Sainsbury's")).toBeInTheDocument()
  })

  it('calls onSelect with shop id when tab clicked', () => {
    const onSelect = vi.fn()
    render(<ShopSelector shops={shops} selectedShopId="s1" onSelect={onSelect} onAddShop={vi.fn()} />)
    fireEvent.click(screen.getByText("Sainsbury's"))
    expect(onSelect).toHaveBeenCalledWith('s2')
  })

  it('renders + tab and calls onAddShop', () => {
    const onAdd = vi.fn()
    render(<ShopSelector shops={shops} selectedShopId="s1" onSelect={vi.fn()} onAddShop={onAdd} />)
    fireEvent.click(screen.getByLabelText('Add shop'))
    expect(onAdd).toHaveBeenCalled()
  })

  it('renders empty state message when no shops exist', () => {
    render(<ShopSelector shops={[]} selectedShopId={null} onSelect={vi.fn()} onAddShop={vi.fn()} />)
    expect(screen.getByText(/add a shop/i)).toBeInTheDocument()
  })
})
