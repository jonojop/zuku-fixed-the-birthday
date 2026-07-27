import { useEffect, useState } from 'react'
import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { useGameDispatch } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import { playDeployTick, playEngineRev } from '../utils/sound'
import type { R33Parts } from '../types/game'
import './ProjectR33Level.css'

const level = LEVELS.find((l) => l.id === 'project-r33')!

const FIX_TO_PART: Record<string, keyof R33Parts> = {
  model: 'model',
  wheels: 'wheels',
  engine: 'engine',
  headlights: 'headlights',
  spoiler: 'spoiler',
}

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const boxOpen = fixIndex >= 1
  const wheelsOn = fixIndex >= 2
  const engineOn = fixIndex >= 3
  const headlightsOn = fixIndex >= 4
  const spoilerOn = isComplete

  return (
    <div className={`r33-scene ${isComplete ? 'r33-scene-complete' : ''}`}>
      {!boxOpen ? (
        <svg viewBox="0 0 240 160" className="r33-box" role="img" aria-label="Caja de regalo cerrada">
          <rect x="30" y="50" width="180" height="90" rx="6" fill="var(--bg-secondary)" stroke="var(--gold)" strokeWidth="3" />
          <path d="M30 50 L120 20 L210 50 Z" fill="var(--red-jp)" />
          <line x1="120" y1="20" x2="120" y2="140" stroke="var(--gold)" strokeWidth="3" />
          <line x1="30" y1="90" x2="210" y2="90" stroke="var(--gold)" strokeWidth="3" />
        </svg>
      ) : (
        <svg viewBox="0 0 260 140" className="r33-car" role="img" aria-label="Nissan Skyline GT-R R33 en construcción">
          <ellipse cx="130" cy="118" rx="105" ry="8" fill="#000" opacity="0.3" />

          <path
            d="M35 100 L45 68 Q70 50 100 50 L150 50 Q175 50 190 68 L225 82 L225 100 Z"
            fill="#26334d"
            stroke="var(--white-warm)"
            strokeWidth="2"
            className="r33-body"
          />
          <path d="M78 66 Q100 54 150 54 Q168 56 178 66 L168 66 L96 66 Z" fill="#0d1220" opacity="0.85" />

          <rect
            x="42"
            y="78"
            width="16"
            height="8"
            rx="2"
            fill={headlightsOn ? 'var(--gold)' : '#3a3f4d'}
            className={headlightsOn ? 'r33-headlight-on' : ''}
          />
          <rect x="205" y="80" width="14" height="7" rx="2" fill="#9d1c2f" />

          <circle cx="80" cy="102" r={wheelsOn ? 16 : 0} fill="#111" stroke="var(--gold)" strokeWidth="2" className="r33-wheel" />
          <circle cx="190" cy="102" r={wheelsOn ? 16 : 0} fill="#111" stroke="var(--gold)" strokeWidth="2" className="r33-wheel" />

          {spoilerOn && (
            <g className="r33-spoiler">
              <rect x="188" y="52" width="4" height="16" fill="var(--white-warm)" />
              <rect x="175" y="46" width="30" height="6" rx="2" fill="var(--white-warm)" />
            </g>
          )}

          {engineOn && (
            <g className="r33-exhaust">
              <circle cx="228" cy="98" r="4" fill="var(--terminal-green)" opacity="0.8" />
              <circle cx="228" cy="98" r="8" fill="var(--terminal-green)" opacity="0.25" className="r33-exhaust-glow" />
            </g>
          )}
        </svg>
      )}

      {isComplete && <p className="r33-caption mono">R33 — build completed</p>}
    </div>
  )
}

function R33RevealScreen({ onContinue }: { onContinue: () => void }) {
  const { url: r33Photo } = useAsset('nissan-r33')
  const [headlightsOn, setHeadlightsOn] = useState(false)

  useEffect(() => {
    playEngineRev()
    const timer = window.setTimeout(() => setHeadlightsOn(true), 700)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="r33-reveal app-shell">
      <div className="r33-reveal-content stack">
        <div className={`r33-reveal-frame${headlightsOn ? ' r33-reveal-headlights' : ''}`}>
          {r33Photo ? (
            <img src={r33Photo} alt="Nissan Skyline GT-R R33 real" className="r33-reveal-photo" />
          ) : (
            <div className="r33-reveal-placeholder mono" aria-hidden="true">
              R33 reveal
            </div>
          )}
        </div>

        <p className="r33-reveal-caption mono">PROJECT R33 — Build completed.</p>
        <p className="r33-reveal-subcaption">Not street legal in this browser.</p>

        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Continuar build
        </button>
      </div>
    </div>
  )
}

export function ProjectR33Level() {
  const dispatch = useGameDispatch()
  const [showReveal, setShowReveal] = useState(false)

  if (showReveal) {
    return <R33RevealScreen onContinue={() => dispatch({ type: 'COMPLETE_LEVEL', levelId: 'project-r33' })} />
  }

  return (
    <FixSequenceLevel
      level={level}
      introLine="Un regalo tecnológico llegó incompleto. Falta ensamblarlo."
      scene={({ fixIndex, isComplete }) => <Scene fixIndex={fixIndex} isComplete={isComplete} />}
      onFixApplied={(fixId) => {
        const part = FIX_TO_PART[fixId]
        if (part) dispatch({ type: 'SET_R33_PART', part })
      }}
      renderComplete={() => (
        <div className="panel stack level-complete-panel">
          <p className="mono level-complete-title">{level.completionTitle}</p>
          <p className="level-complete-subtitle">{level.completionSubtitle}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              playDeployTick()
              setShowReveal(true)
            }}
          >
            Continuar build
          </button>
        </div>
      )}
    />
  )
}
