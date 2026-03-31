import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddItemInput from './AddItemInput'

describe('AddItemInput', () => {
  it('shows + Add item button initially', () => {
    render(<AddItemInput onAdd={vi.fn()} suggestions={[]} />)
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('shows input when + Add item is clicked', async () => {
    render(<AddItemInput onAdd={vi.fn()} suggestions={[]} />)
    await userEvent.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onAdd and resets on Enter', async () => {
    const onAdd = vi.fn()
    render(<AddItemInput onAdd={onAdd} suggestions={[]} />)
    await userEvent.click(screen.getByRole('button', { name: /add item/i }))
    await userEvent.type(screen.getByRole('textbox'), 'Milk{Enter}')
    expect(onAdd).toHaveBeenCalledWith('Milk')
    expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument()
  })

  it('shows filtered suggestions while typing', async () => {
    render(<AddItemInput onAdd={vi.fn()} suggestions={['Milk', 'Mushrooms', 'Eggs']} />)
    await userEvent.click(screen.getByRole('button', { name: /add item/i }))
    await userEvent.type(screen.getByRole('textbox'), 'M')
    expect(screen.getByText('Milk')).toBeInTheDocument()
    expect(screen.getByText('Mushrooms')).toBeInTheDocument()
    expect(screen.queryByText('Eggs')).not.toBeInTheDocument()
  })

  it('calls onAdd with suggestion when suggestion clicked', async () => {
    const onAdd = vi.fn()
    render(<AddItemInput onAdd={onAdd} suggestions={['Milk']} />)
    await userEvent.click(screen.getByRole('button', { name: /add item/i }))
    await userEvent.type(screen.getByRole('textbox'), 'Mi')
    await userEvent.click(screen.getByText('Milk'))
    expect(onAdd).toHaveBeenCalledWith('Milk')
  })
})
