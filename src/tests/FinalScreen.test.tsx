import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider, useGameState } from '../context/GameContext'
import { FinalScreen } from '../components/FinalScreen'
import { PROJECT, ACHIEVEMENTS } from '../content/gameContent'
import { createInitialState } from '../context/gameReducer'
import { LEVEL_ORDER } from '../types/game'

function seedFinalState() {
  const state = {
    ...createInitialState(),
    phase: 'final' as const,
    finalUnlocked: true,
    levelsCompleted: [...LEVEL_ORDER],
    skipAnimations: true,
  }
  localStorage.setItem(PROJECT.storageKey, JSON.stringify(state))
}

function StateProbe() {
  const state = useGameState()
  return <div data-testid="probe">{state.levelsCompleted.length}</div>
}

describe('FinalScreen', () => {
  it('shows all 9 achievement badges, each with an accessible tooltip', async () => {
    seedFinalState()
    const user = userEvent.setup()
    render(
      <GameProvider>
        <FinalScreen />
      </GameProvider>
    )

    expect(screen.getByText('FELIZ CUMPLEAÑOS, ZUKU')).toBeInTheDocument()

    for (const achievement of ACHIEVEMENTS) {
      const button = screen.getByRole('button', { name: achievement.title })
      const describedBy = button.getAttribute('aria-describedby')
      expect(describedBy).toBeTruthy()
      const tooltip = document.getElementById(describedBy!)
      expect(tooltip).not.toBeNull()
      expect(tooltip?.textContent).toContain(achievement.description)
    }

    // Keyboard/touch users can also reveal the tooltip without hovering (click toggles it).
    const firstBadge = screen.getByRole('button', { name: ACHIEVEMENTS[0].title })
    await user.click(firstBadge)
    const tooltipId = firstBadge.getAttribute('aria-describedby')!
    expect(document.getElementById(tooltipId)).toHaveClass('achievement-tooltip-open')
  })

  it('only shows Inspect Build after the deploy reveal, and it opens the secret without touching level progress', async () => {
    seedFinalState()
    const user = userEvent.setup()
    render(
      <GameProvider>
        <FinalScreen />
        <StateProbe />
      </GameProvider>
    )

    const inspectButton = await screen.findByRole('button', { name: /Inspect build/ })
    expect(inspectButton).toBeInTheDocument()
    expect(screen.getByTestId('probe').textContent).toBe('8')

    await user.click(inspectButton)
    // Entering the secret must not change level completion state.
    expect(screen.getByTestId('probe').textContent).toBe('8')
  })
})
