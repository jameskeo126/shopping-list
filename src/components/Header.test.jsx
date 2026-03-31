import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders app title', () => {
    render(<Header onSettingsClick={vi.fn()} onClearAll={vi.fn()} />)
    expect(screen.getByText('Shopping List')).toBeInTheDocument()
  })

  it('calls onSettingsClick when settings button pressed', () => {
    const onSettings = vi.fn()
    render(<Header onSettingsClick={onSettings} onClearAll={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Settings'))
    expect(onSettings).toHaveBeenCalled()
  })

  it('shows clear all option in menu', () => {
    render(<Header onSettingsClick={vi.fn()} onClearAll={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('More options'))
    expect(screen.getByText('Clear all items')).toBeInTheDocument()
  })

  it('shows confirmation dialog before clearing', () => {
    render(<Header onSettingsClick={vi.fn()} onClearAll={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('More options'))
    fireEvent.click(screen.getByText('Clear all items'))
    expect(screen.getByText('Clear all items?')).toBeInTheDocument()
  })

  it('calls onClearAll after confirmation', () => {
    const onClearAll = vi.fn()
    render(<Header onSettingsClick={vi.fn()} onClearAll={onClearAll} />)
    fireEvent.click(screen.getByLabelText('More options'))
    fireEvent.click(screen.getByText('Clear all items'))
    fireEvent.click(screen.getByText('Clear All'))
    expect(onClearAll).toHaveBeenCalled()
  })
})
