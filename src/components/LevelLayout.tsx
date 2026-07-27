import type { ReactNode } from 'react'
import { SoundButton } from './SoundButton'
import { SkipAnimationButton } from './SkipAnimationButton'
import { ProgressBar } from './ProgressBar'
import { ConsolePanel } from './ConsolePanel'
import './LevelLayout.css'

interface LevelLayoutProps {
  code: string
  title: string
  mission: string
  fixDone: number
  fixTotal: number
  overallDone: number
  overallTotal: number
  consoleLines: string[]
  onHint?: () => void
  hintDisabled?: boolean
  scene: ReactNode
  children: ReactNode
}

export function LevelLayout({
  code,
  title,
  mission,
  fixDone,
  fixTotal,
  overallDone,
  overallTotal,
  consoleLines,
  onHint,
  hintDisabled,
  scene,
  children,
}: LevelLayoutProps) {
  return (
    <div className="level-layout">
      <header className="level-header">
        <div className="row level-header-top">
          <span className="level-badge mono">{code}</span>
          <div className="row level-header-actions">
            <SkipAnimationButton />
            <SoundButton />
          </div>
        </div>
        <h1>{title}</h1>
        <p className="level-mission">{mission}</p>
        <ProgressBar label={`Build progress: ${overallDone}/${overallTotal} levels`} value={overallDone} max={overallTotal} />
      </header>

      <div className="level-body">
        <section className="level-scene panel" aria-label="Vista previa del sistema">
          {scene}
        </section>

        <section className="level-panel stack">
          <div className="row level-fix-counter">
            <span className="mono">FIX {Math.min(fixDone, fixTotal)}/{fixTotal}</span>
            {onHint && (
              <button type="button" className="btn btn-ghost btn-hint" onClick={onHint} disabled={hintDisabled}>
                Pista
              </button>
            )}
          </div>

          {children}

          <ConsolePanel lines={consoleLines} />
        </section>
      </div>
    </div>
  )
}
