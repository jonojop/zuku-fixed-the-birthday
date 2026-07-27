import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameProvider } from '../context/GameContext'
import { FirstMatchLevel } from '../levels/FirstMatchLevel'
import { LEVELS } from '../content/gameContent'

describe('FirstMatchLevel', () => {
  it('draws a goal at the left edge and a goal at the right edge, never at top-center', () => {
    const { container } = render(
      <GameProvider>
        <FirstMatchLevel />
      </GameProvider>
    )

    const html = container.innerHTML
    // Left goal mouth rect sits at x=4 (left court edge).
    expect(html).toContain('x="4" y="72"')
    // Right goal mouth rect sits at x=306 (right court edge).
    expect(html).toContain('x="306" y="72"')
    // No goal element parked at the top-center of the court (a soccer-style layout).
    expect(html).not.toMatch(/x="15[0-9]" y="4"/)
  })

  it('shows the Jono and Zuku player labels, never "Zuzu" or "Suku"', () => {
    render(
      <GameProvider>
        <FirstMatchLevel />
      </GameProvider>
    )
    expect(screen.getByText('Jono')).toBeInTheDocument()
    expect(screen.getByText('Zuku')).toBeInTheDocument()
    expect(screen.queryByText('Zuzu')).not.toBeInTheDocument()
    expect(screen.queryByText('Suku')).not.toBeInTheDocument()
  })

  it('has exactly 4 fixes: left goal, right goal, ball, kickoff', () => {
    const level = LEVELS.find((l) => l.id === 'first-match')!
    expect(level.fixes.map((f) => f.id)).toEqual(['left-goal', 'right-goal', 'ball-opacity', 'start-match'])
  })
})
