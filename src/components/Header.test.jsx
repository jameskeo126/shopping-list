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

  it('calls onMealPlanClick from an icon placed before Settings', () => {
    const onMealPlan = vi.fn()
    render(<Header onSettingsClick={vi.fn()} onMealPlanClick={onMealPlan} onClearAll={vi.fn()} />)
    const mealPlan = screen.getByLabelText('Meal plan')
    fireEvent.click(mealPlan)
    expect(onMealPlan).toHaveBeenCalled()
    expect(mealPlan.compareDocumentPosition(screen.getByLabelText('Settings')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows clear options in menu', () => {
    render(<Header onSettingsClick={vi.fn()} onClearAll={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Clear items'))
    expect(screen.getByText('Clear Checked')).toBeInTheDocument()
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('shows confirmation dialog before clearing', () => {
    render(<Header onSettingsClick={vi.fn()} onClearAll={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('Clear items'))
    fireEvent.click(screen.getByText('Clear All'))
    expect(screen.getByText('Clear all items?')).toBeInTheDocument()
  })

  it('calls onClearAll after confirmation', () => {
    const onClearAll = vi.fn()
    render(<Header onSettingsClick={vi.fn()} onClearAll={onClearAll} />)
    fireEvent.click(screen.getByLabelText('Clear items'))
    fireEvent.click(screen.getByText('Clear All'))
    fireEvent.click(screen.getByText('Clear All'))
    expect(onClearAll).toHaveBeenCalled()
  })
})
