import { describe, expect, it } from 'vitest'
import { gameReducer, createInitialState } from '../context/gameReducer'
import { CANDLE_COUNT, LEVEL_ORDER } from '../types/game'

describe('gameReducer', () => {
  it('START_GAME resets progress and moves to the level phase', () => {
    const dirty = { ...createInitialState(), levelsCompleted: ['event-handler' as const], phase: 'final' as const }
    const next = gameReducer(dirty, { type: 'START_GAME' })
    expect(next.phase).toBe('level')
    expect(next.levelsCompleted).toEqual([])
    expect(next.currentLevelIndex).toBe(0)
  })

  it('RESET_PROGRESS wipes everything back to a fresh state', () => {
    const dirty = { ...createInitialState(), candlesLit: [0, 1, 2], zukuSeated: true }
    const next = gameReducer(dirty, { type: 'RESET_PROGRESS' })
    expect(next).toEqual(createInitialState())
  })

  it('APPLY_FIX increments the per-level fix counter', () => {
    let state = createInitialState()
    state = gameReducer(state, { type: 'APPLY_FIX', levelId: 'event-handler' })
    state = gameReducer(state, { type: 'APPLY_FIX', levelId: 'event-handler' })
    expect(state.fixesCompleted['event-handler']).toBe(2)
  })

  it('COMPLETE_LEVEL adds the level once and switches to celebration', () => {
    let state = createInitialState()
    state = gameReducer(state, { type: 'COMPLETE_LEVEL', levelId: 'event-handler' })
    state = gameReducer(state, { type: 'COMPLETE_LEVEL', levelId: 'event-handler' })
    expect(state.levelsCompleted).toEqual(['event-handler'])
    expect(state.phase).toBe('celebration')
  })

  it('ADVANCE_AFTER_CELEBRATION moves to the next level', () => {
    const state = { ...createInitialState(), currentLevelIndex: 0, phase: 'celebration' as const }
    const next = gameReducer(state, { type: 'ADVANCE_AFTER_CELEBRATION' })
    expect(next.phase).toBe('level')
    expect(next.currentLevelIndex).toBe(1)
  })

  it('ADVANCE_AFTER_CELEBRATION on the last level unlocks final and secret', () => {
    const lastIndex = LEVEL_ORDER.length - 1
    const state = { ...createInitialState(), currentLevelIndex: lastIndex, phase: 'celebration' as const }
    const next = gameReducer(state, { type: 'ADVANCE_AFTER_CELEBRATION' })
    expect(next.phase).toBe('final')
    expect(next.finalUnlocked).toBe(true)
    expect(next.secretUnlocked).toBe(true)
  })

  it('LIGHT_CANDLE never exceeds 26 candles and never duplicates an index', () => {
    let state = createInitialState()
    for (let i = 0; i < CANDLE_COUNT; i++) {
      state = gameReducer(state, { type: 'LIGHT_CANDLE', index: i })
    }
    expect(state.candlesLit).toHaveLength(CANDLE_COUNT)

    const outOfRange = gameReducer(state, { type: 'LIGHT_CANDLE', index: 999 })
    expect(outOfRange.candlesLit).toHaveLength(CANDLE_COUNT)

    const duplicate = gameReducer(state, { type: 'LIGHT_CANDLE', index: 0 })
    expect(duplicate.candlesLit).toHaveLength(CANDLE_COUNT)
  })

  it('SET_BLOW_BUTTON_PART only records correct selections', () => {
    let state = createInitialState()
    state = gameReducer(state, { type: 'SET_BLOW_BUTTON_PART', part: 'text', correct: false })
    expect(state.blowButtonParts.text).toBe(false)
    state = gameReducer(state, { type: 'SET_BLOW_BUTTON_PART', part: 'text', correct: true })
    expect(state.blowButtonParts.text).toBe(true)
  })

  it('SET_R33_PART marks the given part as built', () => {
    let state = createInitialState()
    state = gameReducer(state, { type: 'SET_R33_PART', part: 'wheels' })
    expect(state.r33Parts.wheels).toBe(true)
    expect(state.r33Parts.engine).toBe(false)
  })

  it('SEAT_ZUKU flips zukuSeated to true', () => {
    const state = gameReducer(createInitialState(), { type: 'SEAT_ZUKU' })
    expect(state.zukuSeated).toBe(true)
  })

  it('ENTER_SECRET / EXIT_SECRET toggle between secret and final phases', () => {
    const inSecret = gameReducer(createInitialState(), { type: 'ENTER_SECRET' })
    expect(inSecret.phase).toBe('secret')
    expect(inSecret.secretViewed).toBe(true)
    const back = gameReducer(inSecret, { type: 'EXIT_SECRET' })
    expect(back.phase).toBe('final')
  })
})
