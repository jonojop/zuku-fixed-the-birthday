import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider } from '../context/GameContext'
import { RestProtocolLevel } from '../levels/RestProtocolLevel'
import { LEVELS, PROJECT } from '../content/gameContent'
import { createInitialState } from '../context/gameReducer'

vi.mock('../hooks/useAssetManifest', () => ({
  useAsset: (key: string) => {
    if (key === 'zuku-standing') return { url: '/assets/zuku-standing.png', loading: false }
    if (key === 'zuku-sitting') return { url: '/assets/zuku-sitting.png', loading: false }
    return { url: null, loading: false }
  },
}))

const level = LEVELS.find((l) => l.id === 'rest-protocol')!

function seedFastState() {
  const state = { ...createInitialState(), phase: 'level' as const, skipAnimations: true }
  localStorage.setItem(PROJECT.storageKey, JSON.stringify(state))
}

describe('RestProtocolLevel', () => {
  it('requires exactly 5 fixes', () => {
    expect(level.fixCount).toBe(5)
    expect(level.fixes).toHaveLength(5)
  })

  it('shows zuku-standing at the start and keeps zuku-sitting hidden', () => {
    render(
      <GameProvider>
        <RestProtocolLevel />
      </GameProvider>
    )

    const standing = screen.getByAltText('Zuku programando de pie')
    expect(standing).toBeInTheDocument()
    expect(standing).not.toHaveClass('rest-figure-hidden')

    const sitting = screen.getByAltText('Zuku sentado descansando')
    expect(sitting).not.toHaveClass('rest-figure-visible')
  })

  it('reveals zuku-sitting only after the fifth fix, with no chair element ever rendered', async () => {
    seedFastState()
    const user = userEvent.setup()
    const { container } = render(
      <GameProvider>
        <RestProtocolLevel />
      </GameProvider>
    )

    for (const fix of level.fixes) {
      const correct = fix.options.find((o) => o.correct)!
      await user.click(await screen.findByRole('button', { name: correct.label }))
      // Let the (fast, skipAnimations) transition timer resolve before the next fix appears.
      await new Promise((resolve) => setTimeout(resolve, 80))
    }

    const sitting = await screen.findByAltText('Zuku sentado descansando')
    expect(sitting).toHaveClass('rest-figure-visible')
    expect(screen.getByAltText('Zuku programando de pie')).toHaveClass('rest-figure-hidden')
    expect(screen.getByText('Work session completed')).toBeInTheDocument()

    const html = container.innerHTML.toLowerCase()
    expect(html).not.toContain('chair-svg')
    expect(html).not.toContain('floating-chair')
    expect(html).not.toContain('spawned-chair')
    expect(html).not.toContain('rest-chair')
    expect(container.querySelectorAll('[class*="chair"]')).toHaveLength(0)
  })
})
