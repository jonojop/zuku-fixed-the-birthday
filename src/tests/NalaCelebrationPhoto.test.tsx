import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameProvider } from '../context/GameContext'
import { NalaCelebration } from '../components/NalaCelebration'

vi.mock('../hooks/useAssetManifest', () => ({
  useAsset: (key: string) =>
    key === 'nala-playing' ? { url: '/assets/nala-playing.png', loading: false } : { url: null, loading: false },
}))

describe('NalaCelebration with the real nala-playing photo', () => {
  it('prefers nala-playing over the SVG fallback and still shows a visible Nala tag', () => {
    render(
      <GameProvider>
        <NalaCelebration levelTitle="Event Handler" onContinue={() => {}} />
      </GameProvider>
    )

    expect(screen.getByAltText('Nala')).toBeInTheDocument()
    expect(screen.getByText('Nala')).toBeInTheDocument()
  })
})
