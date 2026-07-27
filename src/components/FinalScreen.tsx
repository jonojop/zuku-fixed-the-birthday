import { useEffect, useState } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import { FINAL_CONTENT, SECRET_CONTENT } from '../content/gameContent'
import { ConsolePanel } from './ConsolePanel'
import { ConfirmModal } from './ConfirmModal'
import { SoundButton } from './SoundButton'
import { playDeploySuccess, playTerminalBeep } from '../utils/sound'
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
      playDeploySuccess()
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
          playDeploySuccess()
          window.setTimeout(() => setShowMessage(true), 900)
        }, 400)
      }
    }, 380)
    return () => window.clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="final-screen app-shell">
      <div className="final-topbar row">
        <SoundButton />
      </div>

      <div className="final-content stack">
        <ConsolePanel title="deploy" lines={lines} />

        {showMessage && (
          <div className="final-reveal stack">
            <h1 className="final-headline">{FINAL_CONTENT.headline}</h1>
            <p className="final-message">{FINAL_CONTENT.message}</p>
            <p className="final-achievement mono">{FINAL_CONTENT.achievement}</p>

            {finalPhoto && (
              <div className="final-photo-frame">
                <img src={finalPhoto} alt="Recuerdo de Zuku" className="final-photo" />
              </div>
            )}

            <div className="final-icons" aria-hidden="true">
              <span>⛩️</span>
              <span>🌸</span>
              <span>🏎️</span>
              <span>🤾</span>
              <span>🥧</span>
              <span>🐾</span>
            </div>

            <div className="final-actions row">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => dispatch({ type: 'START_GAME' })}
              >
                REPLAY
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmResetOpen(true)}>
                RESET PROGRESS
              </button>
            </div>

            <button
              type="button"
              className="btn-link final-secret-hint mono"
              onClick={() => dispatch({ type: 'ENTER_SECRET' })}
            >
              {SECRET_CONTENT.discoveryHints[0]}
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
