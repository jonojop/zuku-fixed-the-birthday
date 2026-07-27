import { PROJECT } from '../content/gameContent'
import { CANDLE_COUNT, LEVEL_ORDER, type GameState, type LevelId } from '../types/game'
import { createInitialState } from './gameReducer'

function isLevelId(value: unknown): value is LevelId {
  return typeof value === 'string' && (LEVEL_ORDER as string[]).includes(value)
}

function safeArrayOfLevelIds(value: unknown): LevelId[] {
  if (!Array.isArray(value)) return []
  return value.filter(isLevelId)
}

function safeRecordOfNumbers(value: unknown): Partial<Record<LevelId, number>> {
  if (typeof value !== 'object' || value === null) return {}
  const result: Partial<Record<LevelId, number>> = {}
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (isLevelId(key) && typeof val === 'number' && Number.isFinite(val) && val >= 0) {
      result[key] = val
    }
  }
  return result
}

function safeCandles(value: unknown): number[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<number>()
  for (const item of value) {
    if (typeof item === 'number' && Number.isInteger(item) && item >= 0 && item < CANDLE_COUNT) {
      seen.add(item)
    }
  }
  return [...seen]
}

function safeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

/**
 * Rebuilds a valid GameState from persisted (and possibly corrupted) JSON.
 * Falls back field-by-field to defaults instead of discarding the whole save,
 * since a single bad field shouldn't cost the player their progress.
 */
export function reviveState(raw: unknown): GameState {
  const fallback = createInitialState()
  if (typeof raw !== 'object' || raw === null) return fallback

  const data = raw as Record<string, unknown>
  if (data.version !== 1) return fallback

  const r33Source = (typeof data.r33Parts === 'object' && data.r33Parts !== null ? data.r33Parts : {}) as Record<string, unknown>
  const blowSource = (typeof data.blowButtonParts === 'object' && data.blowButtonParts !== null ? data.blowButtonParts : {}) as Record<string, unknown>

  return {
    version: 1,
    phase: 'boot',
    currentLevelIndex:
      typeof data.currentLevelIndex === 'number' && data.currentLevelIndex >= 0 && data.currentLevelIndex < LEVEL_ORDER.length
        ? data.currentLevelIndex
        : 0,
    levelsCompleted: safeArrayOfLevelIds(data.levelsCompleted),
    fixesCompleted: safeRecordOfNumbers(data.fixesCompleted),
    hintsShown: safeRecordOfNumbers(data.hintsShown),
    soundEnabled: safeBoolean(data.soundEnabled, false),
    skipAnimations: safeBoolean(data.skipAnimations, false),
    candlesLit: safeCandles(data.candlesLit),
    blowButtonParts: {
      text: safeBoolean(blowSource.text, false),
      event: safeBoolean(blowSource.event, false),
      action: safeBoolean(blowSource.action, false),
    },
    candlesBlownOut: safeBoolean(data.candlesBlownOut, false),
    r33Parts: {
      model: safeBoolean(r33Source.model, false),
      wheels: safeBoolean(r33Source.wheels, false),
      engine: safeBoolean(r33Source.engine, false),
      headlights: safeBoolean(r33Source.headlights, false),
      spoiler: safeBoolean(r33Source.spoiler, false),
    },
    zukuSeated: safeBoolean(data.zukuSeated, false),
    secretUnlocked: safeBoolean(data.secretUnlocked, false),
    secretViewed: safeBoolean(data.secretViewed, false),
    finalUnlocked: safeBoolean(data.finalUnlocked, false),
    lastSaved: typeof data.lastSaved === 'string' ? data.lastSaved : null,
  }
}

export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(PROJECT.storageKey)
    if (!raw) return null
    return reviveState(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveState(state: GameState): void {
  try {
    const payload: GameState = { ...state, lastSaved: new Date().toISOString() }
    localStorage.setItem(PROJECT.storageKey, JSON.stringify(payload))
  } catch {
    // Storage unavailable (private mode, quota) — progress simply won't persist.
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(PROJECT.storageKey)
  } catch {
    // ignore
  }
}

export function hasMeaningfulProgress(state: GameState): boolean {
  return (
    state.levelsCompleted.length > 0 ||
    state.finalUnlocked ||
    state.currentLevelIndex > 0 ||
    Object.values(state.fixesCompleted).some((v) => (v ?? 0) > 0)
  )
}

export function hasSavedProgress(): boolean {
  try {
    return localStorage.getItem(PROJECT.storageKey) !== null
  } catch {
    return false
  }
}
