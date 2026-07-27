import { useState } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { LEVELS, LEMON_PIE_CONTENT } from '../content/gameContent'
import { CANDLE_COUNT, LEVEL_ORDER } from '../types/game'
import { LevelLayout } from '../components/LevelLayout'
import { playCandleIgnite, playCandlesBlow, playCorrect, playIncorrect } from '../utils/sound'
import './LemonPieLevel.css'

const level = LEVELS.find((l) => l.id === 'lemon-pie-protocol')!
type PartKey = 'text' | 'event' | 'action'
const PART_ORDER: PartKey[] = ['text', 'event', 'action']

interface Slot {
  x: number
  y: number
}

/** 26 predetermined, non-overlapping candle slots across the pie's top surface (3 rings). */
function generateCandleSlots(): Slot[] {
  const cx = 150
  const cy = 84
  const rings: Array<{ count: number; rx: number; ry: number; offsetDeg: number }> = [
    { count: 13, rx: 104, ry: 28, offsetDeg: 0 },
    { count: 9, rx: 68, ry: 19, offsetDeg: 14 },
    { count: 4, rx: 30, ry: 9, offsetDeg: 30 },
  ]
  const slots: Slot[] = []
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      const angleDeg = (360 / ring.count) * i + ring.offsetDeg
      const rad = (angleDeg * Math.PI) / 180
      slots.push({ x: cx + ring.rx * Math.cos(rad), y: cy + ring.ry * Math.sin(rad) })
    }
  }
  return slots
}

const CANDLE_SLOTS = generateCandleSlots()
const VIEW_W = 300
const VIEW_H = 180

function PieScene({ litIndices, blownOut }: { litIndices: number[]; blownOut: boolean }) {
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="pie-illustration" role="img" aria-label="Lemon pie con 26 velitas">
      <defs>
        <radialGradient id="pieLemonFill" cx="45%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="55%" stopColor="#f2c94c" />
          <stop offset="100%" stopColor="#d9a520" />
        </radialGradient>
        <linearGradient id="pieCrustGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a3d" />
          <stop offset="100%" stopColor="#94622a" />
        </linearGradient>
        <radialGradient id="pieMeringueGrad" cx="50%" cy="15%" r="85%">
          <stop offset="0%" stopColor="#fffdf6" />
          <stop offset="100%" stopColor="#fdedc8" />
        </radialGradient>
        <radialGradient id="pieToasted" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#e8b563" />
          <stop offset="100%" stopColor="#b97b34" />
        </radialGradient>
      </defs>

      {/* contact shadow + serving plate, for a slightly elevated 3/4 perspective */}
      <ellipse cx="150" cy="168" rx="128" ry="9" fill="#000" opacity="0.35" />
      <ellipse cx="150" cy="152" rx="140" ry="19" fill="#e9e4d8" />
      <ellipse cx="150" cy="148" rx="130" ry="15" fill="#d9d3c2" />

      {/* crust + lemon filling dome */}
      <ellipse cx="150" cy="122" rx="116" ry="26" fill="url(#pieCrustGrad)" />
      <ellipse cx="150" cy="102" rx="110" ry="30" fill="url(#pieLemonFill)" />
      <ellipse cx="115" cy="82" rx="38" ry="12" fill="#fff8d8" opacity="0.45" />

      {/* meringue with defined toasted peaks */}
      <path
        d="M42,92 Q62,58 82,90 Q102,56 122,90 Q142,54 162,90 Q182,56 202,90 Q222,58 242,92 Q258,74 256,102 L44,102 Z"
        fill="url(#pieMeringueGrad)"
      />
      {[
        { x: 62, y: 60 },
        { x: 102, y: 58 },
        { x: 142, y: 56 },
        { x: 182, y: 58 },
        { x: 222, y: 60 },
      ].map((peak) => (
        <ellipse key={peak.x} cx={peak.x} cy={peak.y} rx="10" ry="6" fill="url(#pieToasted)" opacity="0.85" />
      ))}

      {blownOut && (
        <g className="pie-smoke" aria-hidden="true">
          <circle cx="90" cy="55" r="5" />
          <circle cx="150" cy="46" r="6" />
          <circle cx="210" cy="55" r="5" />
        </g>
      )}

      {CANDLE_SLOTS.map((slot, i) => {
        const lit = litIndices.includes(i)
        if (!lit) return null
        return (
          <g key={i} className={`pie-candle${blownOut ? ' pie-candle-out' : ''}`} transform={`translate(${slot.x}, ${slot.y})`}>
            <rect x="-2" y="-14" width="4" height="14" rx="1" fill="#f6a6b8" />
            {!blownOut && (
              <>
                <ellipse cx="0" cy="-17" rx="2.6" ry="4" fill="#ffe08a" className="pie-candle-flame" />
                <ellipse cx="0" cy="-16" rx="1.2" ry="2" fill="#fff6d8" />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function LemonPieLevel() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const [, setAttempts] = useState<Record<PartKey, number>>({ text: 0, event: 0, action: 0 })
  const [hints, setHints] = useState<Record<PartKey, boolean>>({ text: false, event: false, action: false })
  const [log, setLog] = useState<string[]>(['26 velas detectadas. Ninguna encendida.'])

  const allLit = state.candlesLit.length >= CANDLE_COUNT
  const allPartsBuilt = state.blowButtonParts.text && state.blowButtonParts.event && state.blowButtonParts.action

  function lightCandle(index: number) {
    if (state.candlesLit.includes(index)) return
    dispatch({ type: 'LIGHT_CANDLE', index })
    playCandleIgnite()
    if (state.candlesLit.length + 1 === CANDLE_COUNT) {
      setLog((l) => [...l, LEMON_PIE_CONTENT.allCandlesOnline])
    }
  }

  function pickPart(part: PartKey, _optionId: string, correct: boolean) {
    if (state.blowButtonParts[part]) return
    if (correct) {
      playCorrect()
      dispatch({ type: 'SET_BLOW_BUTTON_PART', part, correct: true })
      setLog((l) => [...l, `${LEMON_PIE_CONTENT.partLabels[part]} conectado.`])
    } else {
      playIncorrect()
      setAttempts((a) => {
        const next = { ...a, [part]: a[part] + 1 }
        if (next[part] === 2) setHints((h) => ({ ...h, [part]: true }))
        return next
      })
    }
  }

  function handleBlow() {
    dispatch({ type: 'BLOW_CANDLES' })
    playCandlesBlow()
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
          <div className="pie-stage">
            <PieScene litIndices={state.candlesLit} blownOut={state.candlesBlownOut} />

            {!state.candlesBlownOut && (
              <div className="pie-hotspots" role="group" aria-label="Velas del lemon pie, tocá cada una para encenderla">
                {CANDLE_SLOTS.map((slot, i) => {
                  const lit = state.candlesLit.includes(i)
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`pie-hotspot${lit ? ' pie-hotspot-lit' : ''}`}
                      style={{ left: `${(slot.x / VIEW_W) * 100}%`, top: `${(slot.y / VIEW_H) * 100}%` }}
                      onClick={() => lightCandle(i)}
                      disabled={lit}
                      aria-pressed={lit}
                      aria-label={`Vela ${i + 1}${lit ? ' encendida' : ' apagada'}`}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {state.candlesBlownOut && <p className="pie-caption mono">Deploy final desbloqueado.</p>}
        </div>
      }
    >
      <div className="stack lemon-pie-panel">
        <p className="mono lemon-counter">{LEMON_PIE_CONTENT.candlesOnlineLabel(state.candlesLit.length)}</p>

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
