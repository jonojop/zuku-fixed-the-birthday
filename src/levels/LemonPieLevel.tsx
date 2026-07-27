import { useMemo, useState } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { LEVELS, LEMON_PIE_CONTENT } from '../content/gameContent'
import { CANDLE_COUNT, LEVEL_ORDER } from '../types/game'
import { LevelLayout } from '../components/LevelLayout'
import { playCandleLight, playCandlesOut, playClick } from '../utils/sound'
import './LemonPieLevel.css'

const level = LEVELS.find((l) => l.id === 'lemon-pie-protocol')!
type PartKey = 'text' | 'event' | 'action'
const PART_ORDER: PartKey[] = ['text', 'event', 'action']

export function LemonPieLevel() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const [, setAttempts] = useState<Record<PartKey, number>>({ text: 0, event: 0, action: 0 })
  const [hints, setHints] = useState<Record<PartKey, boolean>>({ text: false, event: false, action: false })
  const [log, setLog] = useState<string[]>(['26 velas detectadas. Ninguna encendida.'])

  const allLit = state.candlesLit.length >= CANDLE_COUNT
  const allPartsBuilt = state.blowButtonParts.text && state.blowButtonParts.event && state.blowButtonParts.action

  const candleButtons = useMemo(() => Array.from({ length: CANDLE_COUNT }, (_, i) => i), [])

  function lightCandle(index: number) {
    if (state.candlesLit.includes(index)) return
    dispatch({ type: 'LIGHT_CANDLE', index })
    playCandleLight()
    if (state.candlesLit.length + 1 === CANDLE_COUNT) {
      setLog((l) => [...l, LEMON_PIE_CONTENT.allCandlesOnline])
    }
  }

  function pickPart(part: PartKey, _optionId: string, correct: boolean) {
    if (state.blowButtonParts[part]) return
    if (correct) {
      dispatch({ type: 'SET_BLOW_BUTTON_PART', part, correct: true })
      setLog((l) => [...l, `${LEMON_PIE_CONTENT.partLabels[part]} conectado.`])
    } else {
      playClick()
      setAttempts((a) => {
        const next = { ...a, [part]: a[part] + 1 }
        if (next[part] === 2) setHints((h) => ({ ...h, [part]: true }))
        return next
      })
    }
  }

  function handleBlow() {
    dispatch({ type: 'BLOW_CANDLES' })
    playCandlesOut()
    setLog((l) => [...l, LEMON_PIE_CONTENT.blownMessage])
  }

  return (
    <LevelLayout
      code={level.code}
      title={level.title}
      mission={level.mission}
      fixDone={state.candlesLit.length}
      fixTotal={CANDLE_COUNT}
      overallDone={state.levelsCompleted.length}
      overallTotal={LEVEL_ORDER.length}
      consoleLines={log}
      scene={
        <div className="pie-scene">
          <svg viewBox="0 0 300 150" className="pie-illustration" role="img" aria-label="Lemon pie con 26 velitas">
            <ellipse cx="150" cy="120" rx="120" ry="18" fill="#c98a3d" />
            <path d="M35 120 Q35 60 150 60 Q265 60 265 120 Z" fill="#f2c94c" />
            <path
              d="M35 100 Q60 78 90 96 Q120 74 150 96 Q180 74 210 96 Q240 78 265 100 L265 118 Q150 132 35 118 Z"
              fill="#fff8e7"
              opacity="0.92"
            />
            {state.candlesBlownOut && (
              <g className="pie-smoke" aria-hidden="true">
                <circle cx="90" cy="55" r="5" />
                <circle cx="150" cy="48" r="6" />
                <circle cx="210" cy="55" r="5" />
              </g>
            )}
          </svg>
          {state.candlesBlownOut && <p className="pie-caption mono">Deploy final desbloqueado.</p>}
        </div>
      }
    >
      <div className="stack lemon-pie-panel">
        {!allLit && (
          <>
            <p className="mono lemon-counter">{LEMON_PIE_CONTENT.candlesOnlineLabel(state.candlesLit.length)}</p>
            <div className="candles-grid" role="group" aria-label="Velas del lemon pie, tocá cada una para encenderla">
              {candleButtons.map((i) => {
                const lit = state.candlesLit.includes(i)
                return (
                  <button
                    key={i}
                    type="button"
                    className={`candle-btn${lit ? ' candle-btn-lit' : ''}`}
                    onClick={() => lightCandle(i)}
                    aria-pressed={lit}
                    aria-label={`Vela ${i + 1}${lit ? ' encendida' : ' apagada'}`}
                  >
                    <span className="candle-flame" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </>
        )}

        {allLit && !state.candlesBlownOut && (
          <div className="stack button-builder">
            <p className="mono">Shutdown control missing. Construí el botón.</p>
            {PART_ORDER.map((part) => (
              <div key={part} className="stack builder-part">
                <p className="builder-part-label mono">{LEMON_PIE_CONTENT.partLabels[part]}</p>
                {state.blowButtonParts[part] ? (
                  <p className="builder-part-done mono">✓ {LEMON_PIE_CONTENT.buttonParts[part].find((o) => o.correct)?.label}</p>
                ) : (
                  <>
                    {hints[part] && (
                      <p className="editor-hint">
                        <span aria-hidden="true">💡</span> {LEMON_PIE_CONTENT.partHints[part]}
                      </p>
                    )}
                    <div className="builder-options">
                      {LEMON_PIE_CONTENT.buttonParts[part].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          className="editor-option mono"
                          onClick={() => pickPart(part, opt.id, opt.correct)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            {allPartsBuilt && (
              <button type="button" className="btn btn-primary blow-button" onClick={handleBlow}>
                BLOW CANDLES
              </button>
            )}
          </div>
        )}

        {state.candlesBlownOut && (
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
      </div>
    </LevelLayout>
  )
}
