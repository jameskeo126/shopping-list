import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ItemRow from './ItemRow'

const item        = { id: 'i1', name: 'Milk', sectionId: 'dairy-cheese', checked: false }
const checkedItem = { ...item, checked: true }

describe('ItemRow without a checkbox', () => {
  it('renders no checkbox and still opens edit mode with the delete button', () => {
    render(<ItemRow item={item} showCheckbox={false} onDelete={vi.fn()} />)
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Milk'))
    expect(screen.getByLabelText('Delete item')).toBeInTheDocument()
  })
})

describe('ItemRow trailing content', () => {
  const trailing = <button data-no-edit="">Grip</button>

  it('renders trailing content and tapping it does not open edit mode', () => {
    render(<ItemRow item={item} showCheckbox={false} trailing={trailing} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Grip'))
    expect(screen.queryByLabelText('Delete item')).not.toBeInTheDocument()
  })

  it('hides trailing content while editing', () => {
    render(<ItemRow item={item} showCheckbox={false} trailing={trailing} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByText('Milk'))
    expect(screen.queryByText('Grip')).not.toBeInTheDocument()
  })
})

describe('ItemRow', () => {
  it('renders item name', () => {
    render(<ItemRow item={item} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Milk')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn()
    render(<ItemRow item={item} onToggle={onToggle} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('i1', false)
  })

  it('shows × button when row is tapped', () => {
    render(<ItemRow item={item} onToggle={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByLabelText('Delete item')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Milk'))
    expect(screen.getByLabelText('Delete item')).toBeInTheDocument()
  })

  it('calls onDelete when × is clicked', () => {
    const onDelete = vi.fn()
    render(<ItemRow item={item} onToggle={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByText('Milk'))
    fireEvent.click(screen.getByLabelText('Delete item'))
    expect(onDelete).toHaveBeenCalledWith('i1')
  })

  it('renders checked item as struck through', () => {
    render(<ItemRow item={checkedItem} onToggle={vi.fn()} onDelete={vi.fn()} />)
    const name = screen.getByText('Milk')
    expect(name).toHaveStyle('text-decoration: line-through')
  })
})
