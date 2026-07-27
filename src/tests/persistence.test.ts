import { describe, expect, it, beforeEach } from 'vitest'
import { reviveState, saveState, loadState, hasMeaningfulProgress, clearState } from '../context/persistence'
import { createInitialState } from '../context/gameReducer'
import { PROJECT } from '../content/gameContent'

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('falls back to a fresh state when given garbage', () => {
    expect(reviveState(null)).toEqual(createInitialState())
    expect(reviveState(42)).toEqual(createInitialState())
    expect(reviveState({ version: 2 })).toEqual(createInitialState())
  })

  it('recovers field-by-field from a partially corrupted save instead of discarding it', () => {
    const corrupted = {
      version: 1,
      levelsCompleted: ['event-handler', 'not-a-real-level', 42],
      candlesLit: [1, 2, 2, -5, 999, 'nope'],
      soundEnabled: 'yes please',
      zukuSeated: true,
      r33Parts: { wheels: true, engine: 'maybe' },
    }
    const revived = reviveState(corrupted)
    expect(revived.levelsCompleted).toEqual(['event-handler'])
    expect(revived.candlesLit.sort()).toEqual([1, 2])
    expect(revived.soundEnabled).toBe(false)
    expect(revived.zukuSeated).toBe(true)
    expect(revived.r33Parts.wheels).toBe(true)
    expect(revived.r33Parts.engine).toBe(false)
  })

  it('always revives into the boot phase regardless of what was saved', () => {
    const revived = reviveState({ version: 1, phase: 'final' })
    expect(revived.phase).toBe('boot')
  })

  it('round-trips through localStorage', () => {
    const state = { ...createInitialState(), zukuSeated: true, candlesLit: [1, 2, 3] }
    saveState(state)
    const loaded = loadState()
    expect(loaded?.zukuSeated).toBe(true)
    expect(loaded?.candlesLit).toEqual([1, 2, 3])
  })

  it('clearState removes the save entirely', () => {
    saveState(createInitialState())
    expect(localStorage.getItem(PROJECT.storageKey)).not.toBeNull()
    clearState()
    expect(localStorage.getItem(PROJECT.storageKey)).toBeNull()
  })

  it('hasMeaningfulProgress is false for a brand new game and true after any real progress', () => {
    expect(hasMeaningfulProgress(createInitialState())).toBe(false)
    expect(hasMeaningfulProgress({ ...createInitialState(), levelsCompleted: ['event-handler'] })).toBe(true)
    expect(hasMeaningfulProgress({ ...createInitialState(), fixesCompleted: { 'event-handler': 1 } })).toBe(true)
  })
})
