export type LevelId =
  | 'event-handler'
  | 'css-recovery'
  | 'first-match'
  | 'rest-protocol'
  | 'travel-route'
  | 'production-merge'
  | 'project-r33'
  | 'lemon-pie-protocol'

export const LEVEL_ORDER: LevelId[] = [
  'event-handler',
  'css-recovery',
  'first-match',
  'rest-protocol',
  'travel-route',
  'production-merge',
  'project-r33',
  'lemon-pie-protocol',
]

export const CANDLE_COUNT = 26

export type GamePhase = 'boot' | 'level' | 'celebration' | 'secret' | 'final'

export interface R33Parts {
  model: boolean
  wheels: boolean
  engine: boolean
  headlights: boolean
  spoiler: boolean
}

export interface BlowButtonParts {
  text: boolean
  event: boolean
  action: boolean
}

export interface GameState {
  version: 1
  phase: GamePhase
  currentLevelIndex: number
  levelsCompleted: LevelId[]
  fixesCompleted: Partial<Record<LevelId, number>>
  hintsShown: Partial<Record<LevelId, number>>
  soundEnabled: boolean
  skipAnimations: boolean
  candlesLit: number[]
  blowButtonParts: BlowButtonParts
  candlesBlownOut: boolean
  r33Parts: R33Parts
  zukuSeated: boolean
  secretUnlocked: boolean
  secretViewed: boolean
  finalUnlocked: boolean
  lastSaved: string | null
}

export interface FixOption {
  id: string
  label: string
  correct: boolean
}

export interface FixDefinition {
  id: string
  prompt: string
  hint: string
  options: FixOption[]
  resultLabel: string
}

export interface LevelDefinition {
  id: LevelId
  index: number
  code: string
  title: string
  mission: string
  fixCount: number
  fixes: FixDefinition[]
  completionTitle: string
  completionSubtitle: string
}
