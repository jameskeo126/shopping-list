import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsScreen from './SettingsScreen'

vi.mock('../hooks/useShops', () => ({
  useShops: () => [{ id: 's1', name: 'ALDI', sectionOrder: [] }]
}))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'mock-col'),
  addDoc:     vi.fn(() => Promise.resolve({ id: 'new' })),
  deleteDoc:  vi.fn(() => Promise.resolve()),
  updateDoc:  vi.fn(() => Promise.resolve()),
  doc:        vi.fn((db, col, id) => ({ path: `${col}/${id}` })),
}))
vi.mock('../firebase', () => ({ db: {} }))

describe('SettingsScreen', () => {
  it('renders back button and Shops heading', () => {
    render(<SettingsScreen onBack={vi.fn()} />)
    expect(screen.getByLabelText('Back')).toBeInTheDocument()
    expect(screen.getByText('Shops')).toBeInTheDocument()
  })

  it('calls onBack when back button clicked', () => {
    const onBack = vi.fn()
    render(<SettingsScreen onBack={onBack} />)
    fireEvent.click(screen.getByLabelText('Back'))
    expect(onBack).toHaveBeenCalled()
  })

  it('renders existing shops', () => {
    render(<SettingsScreen onBack={vi.fn()} />)
    expect(screen.getByText('ALDI')).toBeInTheDocument()
  })

  it('shows shop edit screen when shop name clicked', () => {
    render(<SettingsScreen onBack={vi.fn()} />)
    fireEvent.click(screen.getByText('ALDI'))
    expect(screen.getByDisplayValue('ALDI')).toBeInTheDocument()
  })
})
