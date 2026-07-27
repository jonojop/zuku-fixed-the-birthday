import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider } from '../context/GameContext'
import { ProjectR33Level } from '../levels/ProjectR33Level'
import { LEVELS, PROJECT } from '../content/gameContent'
import { createInitialState } from '../context/gameReducer'

vi.mock('../hooks/useAssetManifest', () => ({
  useAsset: (key: string) => (key === 'nissan-r33' ? { url: '/assets/nissan-r33.jpg', loading: false } : { url: null, loading: false }),
}))

const level = LEVELS.find((l) => l.id === 'project-r33')!

function seedFastState() {
  const state = { ...createInitialState(), phase: 'level' as const, skipAnimations: true }
  localStorage.setItem(PROJECT.storageKey, JSON.stringify(state))
}

describe('ProjectR33Level', () => {
  it('requires exactly 5 fixes', () => {
    expect(level.fixCount).toBe(5)
    expect(level.fixes).toHaveLength(5)
  })

  it('does not show the real R33 photo until the SVG build and its completion panel are done', () => {
    render(
      <GameProvider>
        <ProjectR33Level />
      </GameProvider>
    )
    expect(screen.queryByAltText('Nissan Skyline GT-R R33 real')).not.toBeInTheDocument()
  })

  it('reveals the real R33 photo after solving all 5 fixes and confirming the completion panel', async () => {
    seedFastState()
    const user = userEvent.setup()
    render(
      <GameProvider>
        <ProjectR33Level />
      </GameProvider>
    )

    for (const currentFix of level.fixes) {
      const correct = currentFix.options.find((o) => o.correct)!
      await user.click(await screen.findByRole('button', { name: correct.label }))
      await new Promise((resolve) => setTimeout(resolve, 80))
    }

    expect(screen.queryByAltText('Nissan Skyline GT-R R33 real')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar build' }))
    expect(await screen.findByAltText('Nissan Skyline GT-R R33 real')).toBeInTheDocument()
  })
})
