import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders the boot screen on first load without crashing', () => {
    render(<App />)
    expect(screen.getByText('Zuku Fixed the Birthday')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
  })
})
