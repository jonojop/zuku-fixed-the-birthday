import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameProvider, useGameState } from '../context/GameContext'
import { LemonPieLevel } from '../levels/LemonPieLevel'
import { CANDLE_COUNT } from '../types/game'

function StateProbe() {
  const state = useGameState()
  return (
    <div data-testid="state-probe">
      {state.candlesLit.length}|{state.candlesBlownOut ? 'blown' : 'lit'}|{state.levelsCompleted.join(',')}
    </div>
  )
}

describe('LemonPieLevel', () => {
  it('renders exactly 26 candle buttons', () => {
    render(
      <GameProvider>
        <LemonPieLevel />
      </GameProvider>
    )
    const candles = screen.getAllByRole('button', { name: /^Vela \d+/ })
    expect(candles).toHaveLength(CANDLE_COUNT)
  })

  it('lights all candles, builds the button and blows them all out', async () => {
    const user = userEvent.setup()
    render(
      <GameProvider>
        <LemonPieLevel />
        <StateProbe />
      </GameProvider>
    )

    const candles = screen.getAllByRole('button', { name: /^Vela \d+/ })
    for (const candle of candles) {
      await user.click(candle)
    }

    expect(screen.getByTestId('state-probe').textContent).toContain(`${CANDLE_COUNT}|lit`)
    expect(screen.getByText(/All candles online/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'BLOW CANDLES' }))
    await user.click(screen.getByRole('button', { name: 'onClick' }))
    await user.click(screen.getByRole('button', { name: 'extinguishAllCandles()' }))

    const blowButton = screen.getByRole('button', { name: 'BLOW CANDLES' })
    expect(blowButton).toBeEnabled()
    await user.click(blowButton)

    expect(screen.getByTestId('state-probe').textContent).toContain('blown')

    await user.click(screen.getByRole('button', { name: 'Continuar build' }))
    expect(screen.getByTestId('state-probe').textContent).toContain('lemon-pie-protocol')
  })
})
