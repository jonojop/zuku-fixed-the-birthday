import { useEffect, useState } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import { FINAL_CONTENT, ACHIEVEMENTS } from '../content/gameContent'
import { ConsolePanel } from './ConsolePanel'
import { ConfirmModal } from './ConfirmModal'
import { SoundButton } from './SoundButton'
import { AchievementBadge } from './AchievementBadge'
import { FinalBalloons } from './FinalBalloons'
import { playDeployTick, playFinalCelebration, playTerminalBeep, startFinalAmbientMusic, stopFinalAmbientMusic } from '../utils/sound'
import './FinalScreen.css'

export function FinalScreen() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const { url: finalPhoto } = useAsset('final-photo')
  const [lines, setLines] = useState<string[]>([])
  const [showMessage, setShowMessage] = useState(false)
  const [confirmResetOpen, setConfirmResetOpen] = useState(false)

  useEffect(() => {
    if (state.skipAnimations) {
      setLines([...FINAL_CONTENT.deployLines, FINAL_CONTENT.deploySuccessful])
      setShowMessage(true)
      playFinalCelebration()
      return
    }
    let i = 0
    const interval = window.setInterval(() => {
      i += 1
      setLines(FINAL_CONTENT.deployLines.slice(0, i))
      playTerminalBeep()
      if (i >= FINAL_CONTENT.deployLines.length) {
        window.clearInterval(interval)
        window.setTimeout(() => {
          setLines((l) => [...l, FINAL_CONTENT.deploySuccessful])
          playDeployTick()
          window.setTimeout(() => {
            setShowMessage(true)
            playFinalCelebration()
          }, 900)
        }, 400)
      }
    }, 380)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!showMessage) return
    startFinalAmbientMusic()
    return () => stopFinalAmbientMusic()
  }, [showMessage])

  return (
    <div className={`final-screen app-shell${showMessage ? ' final-screen-dimmed' : ''}`}>
      {showMessage && <FinalBalloons />}

      <div className="final-topbar row">
        <SoundButton />
      </div>

      <div className="final-content stack">
        <ConsolePanel title="deploy" lines={lines} />

        {showMessage && (
          <div className="final-reveal stack">
            <div className="final-scrim" aria-hidden="true" />
            <h1 className="final-headline">{FINAL_CONTENT.headline}</h1>
            <p className="final-message">{FINAL_CONTENT.message}</p>
            <p className="final-achievement mono">{FINAL_CONTENT.achievement}</p>

            {finalPhoto && (
              <div className="final-photo-frame">
                <img src={finalPhoto} alt="Recuerdo de Zuku" className="final-photo" />
              </div>
            )}

            <div className="final-achievements" role="group" aria-label="Logros desbloqueados">
              {ACHIEVEMENTS.map((a) => (
                <AchievementBadge key={a.id} id={a.id} icon={a.icon} title={a.title} description={a.description} />
              ))}
            </div>

            <div className="final-actions row">
              <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'START_GAME' })}>
                REPLAY
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmResetOpen(true)}>
                RESET PROGRESS
              </button>
            </div>

            <button
              type="button"
              className="final-inspect-build mono"
              onClick={() => dispatch({ type: 'ENTER_SECRET' })}
              aria-label="Inspect build — archivo sin trackear detectado"
            >
              <span className="final-inspect-arrow" aria-hidden="true">
                ➜
              </span>{' '}
              1 untracked file detected
              <span className="final-inspect-cursor" aria-hidden="true">
                _
              </span>
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmResetOpen}
        title="¿Reiniciar el progreso?"
        message="Se va a borrar todo el build, incluyendo este deploy final."
        confirmLabel="Sí, reiniciar"
        cancelLabel="Cancelar"
        onConfirm={() => {
          setConfirmResetOpen(false)
          dispatch({ type: 'RESET_PROGRESS' })
        }}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  )
}
