import { describe, expect, it } from 'vitest'
import { LEVELS, LEMON_PIE_CONTENT } from '../content/gameContent'

interface Group {
  label: string
  count: number
  correctPosition: number // 1-indexed
}

function collectGroups(): Group[] {
  const groups: Group[] = []
  for (const level of LEVELS) {
    for (const f of level.fixes) {
      const idx = f.options.findIndex((o) => o.correct)
      groups.push({ label: `${level.id}/${f.id}`, count: f.options.length, correctPosition: idx + 1 })
    }
  }
  for (const [part, options] of Object.entries(LEMON_PIE_CONTENT.buttonParts)) {
    const idx = options.findIndex((o) => o.correct)
    groups.push({ label: `lemon-pie/${part}`, count: options.length, correctPosition: idx + 1 })
  }
  return groups
}

describe('answer position distribution', () => {
  const groups = collectGroups()
  const fourOptionGroups = groups.filter((g) => g.count === 4)

  it('every fix has exactly one correct option', () => {
    for (const level of LEVELS) {
      for (const f of level.fixes) {
        expect(f.options.filter((o) => o.correct)).toHaveLength(1)
      }
    }
  })

  it('uses every position (1st-4th) among the four-option fixes', () => {
    const positionsUsed = new Set(fourOptionGroups.map((g) => g.correctPosition))
    expect(positionsUsed).toEqual(new Set([1, 2, 3, 4]))
  })

  it('does not concentrate correct answers in the last position', () => {
    const lastPositionCount = fourOptionGroups.filter((g) => g.correctPosition === g.count).length
    expect(lastPositionCount).toBeLessThan(fourOptionGroups.length / 2)
  })

  it('never repeats the same correct position more than twice in a row', () => {
    let run = 1
    for (let i = 1; i < fourOptionGroups.length; i++) {
      if (fourOptionGroups[i].correctPosition === fourOptionGroups[i - 1].correctPosition) {
        run += 1
        expect(run).toBeLessThanOrEqual(2)
      } else {
        run = 1
      }
    }
  })

  it('keeps a stable order across repeated reads (no per-render reshuffle)', () => {
    const first = collectGroups()
    const second = collectGroups()
    expect(second).toEqual(first)
    expect(second).toEqual(groups)
  })
})
