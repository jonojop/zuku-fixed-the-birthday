import { useCallback, useState } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import type { FixDefinition, LevelId } from '../types/game'

export type FixFeedback = 'idle' | 'correct' | 'incorrect'

export interface FixSequenceApi {
  currentFix: FixDefinition | null
  fixIndex: number
  attempts: number
  hintVisible: boolean
  revealAnswer: boolean
  feedback: FixFeedback
  isComplete: boolean
  submit: (optionId: string) => void
  showHint: () => void
}

/** Drives the shared "pick the correct option" mechanic used by levels 1-3, 5-7. */
export function useFixSequence(levelId: LevelId, fixes: FixDefinition[], onAllComplete: () => void): FixSequenceApi {
  const dispatch = useGameDispatch()
  const state = useGameState()
  const startIndex = Math.min(state.fixesCompleted[levelId] ?? 0, fixes.length)

  const [fixIndex, setFixIndex] = useState(startIndex)
  const [attempts, setAttempts] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  const [revealAnswer, setRevealAnswer] = useState(false)
  const [feedback, setFeedback] = useState<FixFeedback>('idle')

  const isComplete = fixIndex >= fixes.length
  const currentFix = fixes[fixIndex] ?? null
  const delay = state.skipAnimations ? 30 : 650

  const showHint = useCallback(() => {
    setHintVisible(true)
    dispatch({ type: 'REGISTER_HINT', levelId })
  }, [dispatch, levelId])

  const submit = useCallback(
    (optionId: string) => {
      if (!currentFix || feedback !== 'idle') return
      const option = currentFix.options.find((o) => o.id === optionId)
      if (!option) return

      if (option.correct) {
        setFeedback('correct')
        dispatch({ type: 'APPLY_FIX', levelId })
        window.setTimeout(() => {
          setFeedback('idle')
          setAttempts(0)
          setHintVisible(false)
          setRevealAnswer(false)
          if (fixIndex + 1 >= fixes.length) {
            setFixIndex(fixes.length)
            onAllComplete()
          } else {
            setFixIndex((i) => i + 1)
          }
        }, delay)
      } else {
        setFeedback('incorrect')
        setAttempts((a) => {
          const next = a + 1
          if (next === 2) showHint()
          if (next >= 4) setRevealAnswer(true)
          return next
        })
        window.setTimeout(() => setFeedback('idle'), Math.min(delay, 450))
      }
    },
    [currentFix, feedback, dispatch, levelId, fixIndex, fixes.length, onAllComplete, delay, showHint]
  )

  return { currentFix, fixIndex, attempts, hintVisible, revealAnswer, feedback, isComplete, submit, showHint }
}
