import { useEffect, useMemo } from 'react'
import { useAsset } from '../hooks/useAssetManifest'
import { useGameState } from '../context/GameContext'
import { NALA_MESSAGES } from '../content/gameContent'
import { playNalaJump } from '../utils/sound'
import './NalaCelebration.css'

interface NalaCelebrationProps {
  levelTitle: string
  onContinue: () => void
}

export function NalaCelebration({ levelTitle, onContinue }: NalaCelebrationProps) {
  const state = useGameState()
  const { url: nalaPhoto } = useAsset('nala')
  const message = useMemo(() => NALA_MESSAGES[(state.levelsCompleted.length - 1 + NALA_MESSAGES.length) % NALA_MESSAGES.length], [state.levelsCompleted.length])

  useEffect(() => {
    playNalaJump()
    const duration = state.skipAnimations ? 200 : 2600
    const timer = window.setTimeout(onContinue, duration)
    return () => window.clearTimeout(timer)
  }, [onContinue, state.skipAnimations])

  return (
    <div className="nala-celebration app-shell" role="status" aria-live="polite">
      <div className="nala-stage">
        {nalaPhoto ? (
          <img src={nalaPhoto} alt="Nala" className="nala-photo" />
        ) : (
          <svg viewBox="0 0 200 160" className="nala-svg" aria-hidden="true">
            <ellipse cx="100" cy="145" rx="70" ry="8" fill="#000" opacity="0.25" />
            <g className="nala-body">
              <ellipse cx="95" cy="95" rx="55" ry="34" fill="#d6a84b" />
              <circle cx="150" cy="80" r="26" fill="#d6a84b" />
              <path d="M170 58 L182 40 L178 66 Z" fill="#d6a84b" />
              <path d="M132 58 L124 38 L142 60 Z" fill="#d6a84b" />
              <circle cx="160" cy="76" r="3.2" fill="#1c1208" />
              <ellipse cx="176" cy="86" rx="6" ry="4" fill="#1c1208" />
              <path d="M40 95 Q10 80 20 60" stroke="#d6a84b" strokeWidth="14" fill="none" strokeLinecap="round" className="nala-tail" />
              <rect x="140" y="94" width="28" height="10" rx="4" fill="#f8f3e7" className="nala-tag" />
              <text x="154" y="102" textAnchor="middle" fontSize="7" fill="#111827" fontFamily="ui-monospace, monospace">
                Nala
              </text>
            </g>
          </svg>
        )}
      </div>

      <p className="nala-message mono">{message}</p>
      <p className="nala-sublabel">{levelTitle} — fix aprobado</p>

      <button type="button" className="btn btn-gold" onClick={onContinue}>
        Continuar build
      </button>
    </div>
  )
}
