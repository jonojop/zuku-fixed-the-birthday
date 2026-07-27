import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider } from '../context/GameContext'
import { NalaCelebration } from '../components/NalaCelebration'
import { NALA_MESSAGES } from '../content/gameContent'

describe('NalaCelebration', () => {
  it('shows a rotating Nala message and a manual continue control', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()

    render(
      <GameProvider>
        <NalaCelebration levelTitle="Event Handler" onContinue={onContinue} />
      </GameProvider>
    )

    const messageEl = screen.getByRole('status')
    expect(NALA_MESSAGES.some((m) => messageEl.textContent?.includes(m))).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Continuar build' }))
    expect(onContinue).toHaveBeenCalled()
  })

  it('always shows a visible "Nala" tag on the fallback SVG', () => {
    render(
      <GameProvider>
        <NalaCelebration levelTitle="Event Handler" onContinue={() => {}} />
      </GameProvider>
    )
    expect(screen.getByText('Nala')).toBeInTheDocument()
  })
})
