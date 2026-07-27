import { describe, expect, it } from 'vitest'
import { LEVELS, PROJECT, FINAL_CONTENT, NALA_MESSAGES } from '../content/gameContent'
import { CANDLE_COUNT, LEVEL_ORDER } from '../types/game'

describe('gameContent invariants', () => {
  it('has exactly 8 levels in the required order', () => {
    expect(LEVELS).toHaveLength(8)
    expect(LEVELS.map((l) => l.id)).toEqual(LEVEL_ORDER)
  })

  it('names the project "Zuku Fixed the Birthday" everywhere, never "Suku"', () => {
    expect(PROJECT.title).toBe('Zuku Fixed the Birthday')
    const serialized = JSON.stringify({ LEVELS, PROJECT, FINAL_CONTENT, NALA_MESSAGES })
    expect(serialized.toLowerCase()).not.toContain('suku')
  })

  it('rest-protocol has exactly 5 fixes', () => {
    const level = LEVELS.find((l) => l.id === 'rest-protocol')!
    expect(level.fixCount).toBe(5)
    expect(level.fixes).toHaveLength(5)
  })

  it('project-r33 has exactly 5 fixes', () => {
    const level = LEVELS.find((l) => l.id === 'project-r33')!
    expect(level.fixCount).toBe(5)
    expect(level.fixes).toHaveLength(5)
  })

  it('lemon-pie-protocol requires exactly 26 candles', () => {
    const level = LEVELS.find((l) => l.id === 'lemon-pie-protocol')!
    expect(level.fixCount).toBe(26)
    expect(CANDLE_COUNT).toBe(26)
  })

  it('every generic level has exactly one correct option per fix', () => {
    for (const level of LEVELS) {
      for (const fix of level.fixes) {
        const correctCount = fix.options.filter((o) => o.correct).length
        expect(correctCount).toBe(1)
      }
    }
  })

  it('final message is signed by Jonococina', () => {
    expect(FINAL_CONTENT.message).toContain('Jonococina')
    expect(FINAL_CONTENT.headline).toBe('FELIZ CUMPLEAÑOS, ZUKU')
  })
})
