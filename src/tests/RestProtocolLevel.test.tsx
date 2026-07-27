import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider } from '../context/GameContext'
import { RestProtocolLevel } from '../levels/RestProtocolLevel'
import { LEVELS, PROJECT, REST_PROTOCOL_CONTENT } from '../content/gameContent'
import { createInitialState } from '../context/gameReducer'

vi.mock('../hooks/useAssetManifest', () => ({
  useAsset: (key: string) => {
    const known: Record<string, string> = {
      'zuku-selfie': '/assets/zuku-selfie.png',
      'zuku-standing': '/assets/zuku-standing.png',
      'zuku-sitting': '/assets/zuku-sitting.png',
    }
    return { url: known[key] ?? null, loading: false }
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

  it('shows the selfie and the START DEBUGGING button before the editor appears', () => {
    render(
      <GameProvider>
        <RestProtocolLevel />
      </GameProvider>
    )

    expect(screen.getByAltText('Zuku mirando hacia la cámara')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: REST_PROTOCOL_CONTENT.startButtonLabel })).toBeInTheDocument()
    expect(screen.queryByAltText('Zuku programando de pie, de espaldas')).not.toBeInTheDocument()
    expect(screen.queryByAltText('Zuku sentado descansando, de espaldas')).not.toBeInTheDocument()
  })

  it('switches from the selfie to zuku-standing after pressing START DEBUGGING', async () => {
    seedFastState()
    const user = userEvent.setup()
    render(
      <GameProvider>
        <RestProtocolLevel />
      </GameProvider>
    )

    await user.click(screen.getByRole('button', { name: REST_PROTOCOL_CONTENT.startButtonLabel }))
    const standing = await screen.findByAltText('Zuku programando de pie, de espaldas')
    expect(standing).toBeInTheDocument()
    expect(screen.queryByAltText('Zuku mirando hacia la cámara')).not.toBeInTheDocument()

    const sitting = screen.queryByAltText('Zuku sentado descansando, de espaldas')
    if (sitting) expect(sitting).not.toHaveClass('rest-figure-visible')
  })

  it('reveals zuku-sitting only after the fifth fix, hides zuku-standing, and never renders a chair', async () => {
    seedFastState()
    const user = userEvent.setup()
    const { container } = render(
      <GameProvider>
        <RestProtocolLevel />
      </GameProvider>
    )

    await user.click(screen.getByRole('button', { name: REST_PROTOCOL_CONTENT.startButtonLabel }))
    await screen.findByAltText('Zuku programando de pie, de espaldas')

    for (const currentFix of level.fixes) {
      const correct = currentFix.options.find((o) => o.correct)!
      await user.click(await screen.findByRole('button', { name: correct.label }))
      // Let the (fast, skipAnimations) transition timer resolve before the next fix appears.
      await new Promise((resolve) => setTimeout(resolve, 80))
    }

    const sitting = await screen.findByAltText('Zuku sentado descansando, de espaldas')
    expect(sitting).toHaveClass('rest-figure-visible')
    expect(screen.getByAltText('Zuku programando de pie, de espaldas')).toHaveClass('rest-figure-hidden')
    expect(screen.getByText(REST_PROTOCOL_CONTENT.sessionCompletedCaption)).toBeInTheDocument()

    const html = container.innerHTML.toLowerCase()
    expect(html).not.toContain('chair-svg')
    expect(html).not.toContain('floating-chair')
    expect(html).not.toContain('spawned-chair')
    expect(html).not.toContain('animated-chair')
    expect(container.querySelectorAll('[class*="chair"]')).toHaveLength(0)
  })
})
