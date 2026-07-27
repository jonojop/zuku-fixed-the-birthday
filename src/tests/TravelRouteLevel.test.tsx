import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider, useGameState } from '../context/GameContext'
import { TravelRouteLevel } from '../levels/TravelRouteLevel'
import { LEVELS, PROJECT } from '../content/gameContent'
import { createInitialState } from '../context/gameReducer'

vi.mock('../hooks/useAssetManifest', () => ({
  useAsset: (key: string) => (key === 'zuku-japan' ? { url: '/assets/zuku-japan.png', loading: false } : { url: null, loading: false }),
}))

const level = LEVELS.find((l) => l.id === 'travel-route')!

function seedFastState() {
  const state = { ...createInitialState(), phase: 'level' as const, skipAnimations: true }
  localStorage.setItem(PROJECT.storageKey, JSON.stringify(state))
}

function StateProbe() {
  const state = useGameState()
  return <div data-testid="probe">{state.levelsCompleted.join(',')}</div>
}

describe('TravelRouteLevel', () => {
  it('does not show the Japan photo before finishing the route fixes', () => {
    render(
      <GameProvider>
        <TravelRouteLevel />
      </GameProvider>
    )
    expect(screen.queryByAltText('Zuku recién llegado a Japón')).not.toBeInTheDocument()
  })

  it('reveals the Japan photo only after CONTINUE BUILD, and only unlocks the next level from there', async () => {
    seedFastState()
    const user = userEvent.setup()
    render(
      <GameProvider>
        <TravelRouteLevel />
        <StateProbe />
      </GameProvider>
    )

    for (const currentFix of level.fixes) {
      const correct = currentFix.options.find((o) => o.correct)!
      await user.click(await screen.findByRole('button', { name: correct.label }))
      await new Promise((resolve) => setTimeout(resolve, 80))
    }

    // Fixes done: still no Japan photo, level not marked complete yet.
    expect(screen.queryByAltText('Zuku recién llegado a Japón')).not.toBeInTheDocument()
    expect(screen.getByTestId('probe').textContent).toBe('')

    await user.click(screen.getByRole('button', { name: 'CONTINUE BUILD' }))

    expect(await screen.findByAltText('Zuku recién llegado a Japón')).toBeInTheDocument()
    // Reaching the reveal screen must not, by itself, unlock the next level yet.
    expect(screen.getByTestId('probe').textContent).toBe('')

    await user.click(screen.getByRole('button', { name: 'Continuar build' }))
    expect(screen.getByTestId('probe').textContent).toBe('travel-route')
  })
})
