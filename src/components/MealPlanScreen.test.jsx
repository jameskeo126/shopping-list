import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MealPlanScreen from './MealPlanScreen'
import { useMealPlan } from '../hooks/useMealPlan'

vi.mock('../hooks/useMealPlan', () => ({ useMealPlan: vi.fn() }))

const addMeal = vi.fn()
const clearWeek = vi.fn()

function renderScreen(meals = []) {
  useMealPlan.mockReturnValue({
    meals,
    mealHistory: [],
    addMeal,
    editMeal: vi.fn(),
    deleteMeal: vi.fn(),
    clearWeek,
    moveDinner: vi.fn(),
  })
  return render(<MealPlanScreen onBack={vi.fn()} />)
}

const dayBlock = name => screen.getByRole('heading', { name }).parentElement

describe('MealPlanScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
  })

  it('opens at the top of the page', () => {
    renderScreen()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('shows the three meal headers', () => {
    renderScreen()
    for (const name of ['Breakfast', 'Lunches', 'Dinners']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
  })

  it('lists the days from Saturday to Friday', () => {
    renderScreen()
    const days = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)
    expect(days).toEqual(['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  })

  it('puts each entry under its own slot, without checkboxes', () => {
    renderScreen([
      { id: 'm1', name: 'Porridge', slot: 'breakfast' },
      { id: 'm2', name: 'Chilli', slot: 'tuesday' },
    ])
    expect(within(screen.getByRole('heading', { name: 'Breakfast' }).parentElement).getByText('Porridge')).toBeInTheDocument()
    expect(within(dayBlock('Tuesday')).getByText('Chilli')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('calls onBack from the back button', () => {
    const onBack = vi.fn()
    useMealPlan.mockReturnValue({ meals: [], mealHistory: [] })
    render(<MealPlanScreen onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('Back'))
    expect(onBack).toHaveBeenCalled()
  })

  it('adds a dinner to the day it was typed under', async () => {
    renderScreen()
    await userEvent.click(within(dayBlock('Tuesday')).getByRole('button', { name: /add item/i }))
    await userEvent.type(screen.getByRole('textbox'), 'Fish pie{Enter}')
    expect(addMeal).toHaveBeenCalledWith('Fish pie', 'tuesday')
  })

  it('offers Add item only on days without a dinner', () => {
    renderScreen([{ id: 'm1', name: 'Chilli', slot: 'tuesday' }])
    expect(within(dayBlock('Tuesday')).queryByRole('button', { name: /add item/i })).not.toBeInTheDocument()
    expect(within(dayBlock('Monday')).getByRole('button', { name: /add item/i })).toBeInTheDocument()
  })

  it('allows several breakfast entries alongside Add item', () => {
    renderScreen([
      { id: 'm1', name: 'Porridge', slot: 'breakfast' },
      { id: 'm2', name: 'Toast', slot: 'breakfast' },
    ])
    const block = screen.getByRole('heading', { name: 'Breakfast' }).parentElement
    expect(within(block).getByText('Toast')).toBeInTheDocument()
    expect(within(block).getByRole('button', { name: /add item/i })).toBeInTheDocument()
  })

  it('gives dinners a move handle, but not breakfasts', () => {
    renderScreen([
      { id: 'm1', name: 'Porridge', slot: 'breakfast' },
      { id: 'm2', name: 'Chilli', slot: 'tuesday' },
    ])
    expect(screen.getAllByLabelText('Move dinner')).toHaveLength(1)
  })

  it('clears the week only after confirming', () => {
    renderScreen([{ id: 'm1', name: 'Chilli', slot: 'tuesday' }])
    fireEvent.click(screen.getByLabelText('Clear week'))
    expect(screen.getByText('Clear this week?')).toBeInTheDocument()
    expect(clearWeek).not.toHaveBeenCalled()
    fireEvent.click(screen.getByText('Clear Week'))
    expect(clearWeek).toHaveBeenCalled()
    expect(screen.queryByText('Clear this week?')).not.toBeInTheDocument()
  })

  it('does not clear the week when cancelled', () => {
    renderScreen()
    fireEvent.click(screen.getByLabelText('Clear week'))
    fireEvent.click(screen.getByText('Cancel'))
    expect(clearWeek).not.toHaveBeenCalled()
  })
})
