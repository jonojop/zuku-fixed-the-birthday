import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { useFixSequence } from '../hooks/useFixSequence'
import { LEVEL_ORDER, type LevelDefinition } from '../types/game'
import { LevelLayout } from './LevelLayout'
import { SimulatedEditor } from './SimulatedEditor'
import './FixSequenceLevel.css'

interface FixSequenceLevelProps {
  level: LevelDefinition
  introLine: string
  scene: (opts: { fixIndex: number; isComplete: boolean }) => ReactNode
  onFixApplied?: (fixId: string) => void
}

export function FixSequenceLevel({ level, introLine, scene, onFixApplied }: FixSequenceLevelProps) {
  const dispatch = useGameDispatch()
  const state = useGameState()
  const [log, setLog] = useState<string[]>([introLine])

  const handleAllComplete = useCallback(() => {
    setLog((l) => [...l, level.completionTitle, level.completionSubtitle])
  }, [level])

  const seq = useFixSequence(level.id, level.fixes, handleAllComplete)

  const prevFixIndexRef = useRef(seq.fixIndex)
  useEffect(() => {
    if (seq.fixIndex > prevFixIndexRef.current) {
      const completedFix = level.fixes[prevFixIndexRef.current]
      if (completedFix) {
        setLog((l) => [...l, completedFix.resultLabel])
        onFixApplied?.(completedFix.id)
      }
      prevFixIndexRef.current = seq.fixIndex
    }
  }, [seq.fixIndex, level.fixes, onFixApplied])

  return (
    <LevelLayout
      code={level.code}
      title={level.title}
      mission={level.mission}
      fixDone={seq.fixIndex}
      fixTotal={level.fixCount}
      overallDone={state.levelsCompleted.length}
      overallTotal={LEVEL_ORDER.length}
      consoleLines={log}
      onHint={seq.currentFix ? seq.showHint : undefined}
      hintDisabled={seq.hintVisible || !seq.currentFix}
      scene={scene({ fixIndex: seq.fixIndex, isComplete: seq.isComplete })}
    >
      {seq.currentFix ? (
        <SimulatedEditor
          fix={seq.currentFix}
          feedback={seq.feedback}
          hintVisible={seq.hintVisible}
          revealAnswer={seq.revealAnswer}
          onSubmit={seq.submit}
        />
      ) : (
        <div className="panel stack level-complete-panel">
          <p className="mono level-complete-title">{level.completionTitle}</p>
          <p className="level-complete-subtitle">{level.completionSubtitle}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch({ type: 'COMPLETE_LEVEL', levelId: level.id })}
          >
            Continuar build
          </button>
        </div>
      )}
    </LevelLayout>
  )
}
