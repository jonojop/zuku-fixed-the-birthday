import { CANDLE_COUNT, LEVEL_ORDER, type GameState, type LevelId, type R33Parts } from '../types/game'

export function createInitialState(): GameState {
  return {
    version: 1,
    phase: 'boot',
    currentLevelIndex: 0,
    levelsCompleted: [],
    fixesCompleted: {},
    hintsShown: {},
    soundEnabled: false,
    skipAnimations: false,
    candlesLit: [],
    blowButtonParts: { text: false, event: false, action: false },
    candlesBlownOut: false,
    r33Parts: { model: false, wheels: false, engine: false, headlights: false, spoiler: false },
    zukuSeated: false,
    secretUnlocked: false,
    secretViewed: false,
    finalUnlocked: false,
    lastSaved: null,
  }
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'CONTINUE_GAME' }
  | { type: 'RESET_PROGRESS' }
  | { type: 'APPLY_FIX'; levelId: LevelId }
  | { type: 'REGISTER_HINT'; levelId: LevelId }
  | { type: 'COMPLETE_LEVEL'; levelId: LevelId }
  | { type: 'ADVANCE_AFTER_CELEBRATION' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_SKIP_ANIMATIONS' }
  | { type: 'LIGHT_CANDLE'; index: number }
  | { type: 'SET_BLOW_BUTTON_PART'; part: keyof GameState['blowButtonParts']; correct: boolean }
  | { type: 'BLOW_CANDLES' }
  | { type: 'SET_R33_PART'; part: keyof R33Parts }
  | { type: 'SEAT_ZUKU' }
  | { type: 'ENTER_SECRET' }
  | { type: 'EXIT_SECRET' }
  | { type: 'HYDRATE'; state: GameState }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...createInitialState(), phase: 'level' }

    case 'CONTINUE_GAME':
      return { ...state, phase: state.finalUnlocked ? 'final' : 'level' }

    case 'RESET_PROGRESS':
      return createInitialState()

    case 'APPLY_FIX': {
      const current = state.fixesCompleted[action.levelId] ?? 0
      return {
        ...state,
        fixesCompleted: { ...state.fixesCompleted, [action.levelId]: current + 1 },
      }
    }

    case 'REGISTER_HINT': {
      const current = state.hintsShown[action.levelId] ?? 0
      return { ...state, hintsShown: { ...state.hintsShown, [action.levelId]: current + 1 } }
    }

    case 'COMPLETE_LEVEL': {
      const alreadyDone = state.levelsCompleted.includes(action.levelId)
      return {
        ...state,
        levelsCompleted: alreadyDone ? state.levelsCompleted : [...state.levelsCompleted, action.levelId],
        phase: 'celebration',
      }
    }

    case 'ADVANCE_AFTER_CELEBRATION': {
      const isLast = state.currentLevelIndex >= LEVEL_ORDER.length - 1
      if (isLast) {
        return { ...state, phase: 'final', finalUnlocked: true, secretUnlocked: true }
      }
      return { ...state, phase: 'level', currentLevelIndex: state.currentLevelIndex + 1 }
    }

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled }

    case 'TOGGLE_SKIP_ANIMATIONS':
      return { ...state, skipAnimations: !state.skipAnimations }

    case 'LIGHT_CANDLE': {
      if (action.index < 0 || action.index >= CANDLE_COUNT) return state
      if (state.candlesLit.includes(action.index)) return state
      return { ...state, candlesLit: [...state.candlesLit, action.index] }
    }

    case 'SET_BLOW_BUTTON_PART': {
      if (!action.correct) return state
      return { ...state, blowButtonParts: { ...state.blowButtonParts, [action.part]: true } }
    }

    case 'BLOW_CANDLES':
      return { ...state, candlesBlownOut: true }

    case 'SET_R33_PART':
      return { ...state, r33Parts: { ...state.r33Parts, [action.part]: true } }

    case 'SEAT_ZUKU':
      return { ...state, zukuSeated: true }

    case 'ENTER_SECRET':
      return { ...state, phase: 'secret', secretViewed: true }

    case 'EXIT_SECRET':
      return { ...state, phase: 'final' }

    case 'HYDRATE':
      return { ...action.state, phase: 'boot' }

    default:
      return state
  }
}
