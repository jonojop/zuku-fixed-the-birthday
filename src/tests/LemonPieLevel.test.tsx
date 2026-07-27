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

  it('starts with zero candles physically on the pie, and adds them one by one as each is activated', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <GameProvider>
        <LemonPieLevel />
      </GameProvider>
    )

    expect(container.querySelectorAll('.pie-candle')).toHaveLength(0)

    const candles = screen.getAllByRole('button', { name: /^Vela \d+/ })
    for (let i = 0; i < 10; i++) {
      await user.click(candles[i])
      expect(container.querySelectorAll('.pie-candle')).toHaveLength(i + 1)
    }

    for (let i = 10; i < CANDLE_COUNT; i++) {
      await user.click(candles[i])
    }
    expect(container.querySelectorAll('.pie-candle')).toHaveLength(CANDLE_COUNT)
    expect(container.querySelectorAll('.pie-candle-flame')).toHaveLength(CANDLE_COUNT)
  })

  it('keeps all 26 candles on the pie after BLOW CANDLES, but with zero active flames', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <GameProvider>
        <LemonPieLevel />
      </GameProvider>
    )

    for (const candle of screen.getAllByRole('button', { name: /^Vela \d+/ })) {
      await user.click(candle)
    }
    await user.click(screen.getByRole('button', { name: 'BLOW CANDLES' }))
    await user.click(screen.getByRole('button', { name: 'onClick' }))
    await user.click(screen.getByRole('button', { name: 'extinguishAllCandles()' }))
    await user.click(screen.getByRole('button', { name: 'BLOW CANDLES' }))

    expect(container.querySelectorAll('.pie-candle')).toHaveLength(CANDLE_COUNT)
    expect(container.querySelectorAll('.pie-candle-flame')).toHaveLength(0)
    expect(container.querySelector('.pie-illustration')).toBeInTheDocument()
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
