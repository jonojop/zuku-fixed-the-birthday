import type { FixDefinition } from '../types/game'
import type { FixFeedback } from '../hooks/useFixSequence'
import './SimulatedEditor.css'

interface SimulatedEditorProps {
  fix: FixDefinition
  feedback: FixFeedback
  hintVisible: boolean
  revealAnswer: boolean
  lastSubmittedId?: string | null
  onSubmit: (optionId: string) => void
}

export function SimulatedEditor({ fix, feedback, hintVisible, revealAnswer, lastSubmittedId, onSubmit }: SimulatedEditorProps) {
  // Option order comes pre-computed from gameContent.ts (balanced correct-answer
  // position, stable per fix) — never reshuffled here, so it never changes across
  // re-renders or retries within the same attempt.
  const options = fix.options

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
          const isTarget = lastSubmittedId === opt.id && feedback !== 'idle'
          const flashClass = isTarget ? (feedback === 'correct' ? ' editor-option-flash-correct' : ' editor-option-flash-incorrect') : ''
          return (
            <li key={opt.id}>
              <button
                type="button"
                className={`editor-option mono${isRevealed ? ' editor-option-reveal' : ''}${flashClass}`}
                onClick={() => onSubmit(opt.id)}
                disabled={feedback === 'correct'}
              >
                <span className="editor-option-marker" aria-hidden="true">
                  {'>'}
                </span>
                {opt.label}
                {isTarget && (
                  <span className="editor-option-mark" aria-hidden="true">
                    {feedback === 'correct' ? '✓' : '✕'}
                  </span>
                )}
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
