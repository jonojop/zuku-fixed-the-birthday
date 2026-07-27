import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider } from '../context/GameContext'
import { BootScreen } from '../components/BootScreen'
import { PROJECT } from '../content/gameContent'
import { createInitialState } from '../context/gameReducer'

describe('BootScreen', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows START and no reset option when there is no saved progress', () => {
    render(
      <GameProvider>
        <BootScreen />
      </GameProvider>
    )
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'RESET PROGRESS' })).not.toBeInTheDocument()
  })

  it('shows CONTINUE BUILD and RESET PROGRESS when progress exists', () => {
    const saved = { ...createInitialState(), levelsCompleted: ['event-handler' as const] }
    localStorage.setItem(PROJECT.storageKey, JSON.stringify(saved))

    render(
      <GameProvider>
        <BootScreen />
      </GameProvider>
    )
    expect(screen.getByRole('button', { name: 'CONTINUE BUILD' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'RESET PROGRESS' })).toBeInTheDocument()
  })

  it('RESET PROGRESS requires confirmation before wiping the save', async () => {
    const user = userEvent.setup()
    const saved = { ...createInitialState(), levelsCompleted: ['event-handler' as const] }
    localStorage.setItem(PROJECT.storageKey, JSON.stringify(saved))

    render(
      <GameProvider>
        <BootScreen />
      </GameProvider>
    )

    await user.click(screen.getByRole('button', { name: 'RESET PROGRESS' }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    // Progress must survive a cancelled reset.
    expect(screen.getByRole('button', { name: 'CONTINUE BUILD' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'RESET PROGRESS' }))
    await user.click(screen.getByRole('button', { name: 'Sí, reiniciar' }))
    expect(screen.getByRole('button', { name: 'START' })).toBeInTheDocument()
  })
})
