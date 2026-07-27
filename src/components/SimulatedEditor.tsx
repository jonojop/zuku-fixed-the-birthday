import { useMemo } from 'react'
import type { FixDefinition } from '../types/game'
import type { FixFeedback } from '../hooks/useFixSequence'
import './SimulatedEditor.css'

interface SimulatedEditorProps {
  fix: FixDefinition
  feedback: FixFeedback
  hintVisible: boolean
  revealAnswer: boolean
  onSubmit: (optionId: string) => void
}

function shuffled<T>(items: T[], seed: string): T[] {
  const arr = [...items]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) >>> 0
    const j = hash % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function SimulatedEditor({ fix, feedback, hintVisible, revealAnswer, onSubmit }: SimulatedEditorProps) {
  const options = useMemo(() => shuffled(fix.options, fix.id), [fix])

  return (
    <div className="simulated-editor panel">
      <p className="editor-prompt mono">{fix.prompt}</p>

      {hintVisible && (
        <p className="editor-hint" role="status">
          <span aria-hidden="true">💡</span> {fix.hint}
        </p>
      )}

      <ul className="editor-options" role="list">
        {options.map((opt) => {
          const isRevealed = revealAnswer && opt.correct
          return (
            <li key={opt.id}>
              <button
                type="button"
                className={`editor-option mono${isRevealed ? ' editor-option-reveal' : ''}`}
                onClick={() => onSubmit(opt.id)}
                disabled={feedback === 'correct'}
              >
                <span className="editor-option-marker" aria-hidden="true">
                  {'>'}
                </span>
                {opt.label}
              </button>
            </li>
          )
        })}
      </ul>

      <p className="visually-hidden" role="status" aria-live="assertive">
        {feedback === 'correct' ? fix.resultLabel : feedback === 'incorrect' ? 'Opción incorrecta, intentá de nuevo.' : ''}
      </p>
    </div>
  )
}
