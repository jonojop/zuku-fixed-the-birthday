import { useEffect } from 'react'
import { GameProvider, useGameDispatch, useGameState } from './context/GameContext'
import { JapaneseBackground } from './components/JapaneseBackground'
import { BootScreen } from './components/BootScreen'
import { NalaCelebration } from './components/NalaCelebration'
import { FinalScreen } from './components/FinalScreen'
import { LEVEL_ORDER, type LevelId } from './types/game'
import { LEVELS } from './content/gameContent'
import { setSoundEnabled } from './utils/sound'
import { EventHandlerLevel } from './levels/EventHandlerLevel'
import { CssRecoveryLevel } from './levels/CssRecoveryLevel'
import { FirstMatchLevel } from './levels/FirstMatchLevel'
import { RestProtocolLevel } from './levels/RestProtocolLevel'
import { TravelRouteLevel } from './levels/TravelRouteLevel'
import { ProductionMergeLevel } from './levels/ProductionMergeLevel'
import { ProjectR33Level } from './levels/ProjectR33Level'
import { LemonPieLevel } from './levels/LemonPieLevel'
import { SecretArchive } from './levels/SecretArchive'

const LEVEL_COMPONENTS: Record<LevelId, () => React.JSX.Element> = {
  'event-handler': EventHandlerLevel,
  'css-recovery': CssRecoveryLevel,
  'first-match': FirstMatchLevel,
  'rest-protocol': RestProtocolLevel,
  'travel-route': TravelRouteLevel,
  'production-merge': ProductionMergeLevel,
  'project-r33': ProjectR33Level,
  'lemon-pie-protocol': LemonPieLevel,
}

function GameRouter() {
  const state = useGameState()
  const dispatch = useGameDispatch()

  useEffect(() => {
    setSoundEnabled(state.soundEnabled)
  }, [state.soundEnabled])

  switch (state.phase) {
    case 'boot':
      return <BootScreen />

    case 'level': {
      const levelId = LEVEL_ORDER[state.currentLevelIndex]
      const LevelComponent = LEVEL_COMPONENTS[levelId]
      return <LevelComponent />
    }

    case 'celebration': {
      const levelId = LEVEL_ORDER[state.currentLevelIndex]
      const level = LEVELS.find((l) => l.id === levelId)
      return (
        <NalaCelebration
          levelTitle={level?.title ?? ''}
          onContinue={() => dispatch({ type: 'ADVANCE_AFTER_CELEBRATION' })}
        />
      )
    }

    case 'secret':
      return <SecretArchive />

    case 'final':
      return <FinalScreen />

    default:
      return <BootScreen />
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className="app-shell">
        <JapaneseBackground />
        <div className="noise-overlay" />
        <GameRouter />
      </div>
    </GameProvider>
  )
}
