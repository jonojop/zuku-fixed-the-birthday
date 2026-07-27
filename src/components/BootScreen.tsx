import { useState } from 'react'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { hasMeaningfulProgress } from '../context/persistence'
import { BOOT_SEQUENCE, AUTH_SEQUENCE, PROJECT } from '../content/gameContent'
import { ConsolePanel } from './ConsolePanel'
import { ConfirmModal } from './ConfirmModal'
import { SoundButton } from './SoundButton'
import { playTerminalBeep, playDeployTick } from '../utils/sound'
import './BootScreen.css'

export function BootScreen() {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const [booting, setBooting] = useState(false)
  const [bootLines, setBootLines] = useState<string[]>(BOOT_SEQUENCE)
  const [confirmResetOpen, setConfirmResetOpen] = useState(false)

  const canContinue = hasMeaningfulProgress(state)

  function runBootSequence(onFinished: () => void) {
    if (state.skipAnimations) {
      setBootLines([...BOOT_SEQUENCE, '', ...AUTH_SEQUENCE])
      onFinished()
      return
    }
    let i = 0
    const interval = window.setInterval(() => {
      i += 1
      setBootLines([...BOOT_SEQUENCE, '', ...AUTH_SEQUENCE.slice(0, i)])
      playTerminalBeep()
      if (i >= AUTH_SEQUENCE.length) {
        window.clearInterval(interval)
        window.setTimeout(onFinished, 500)
      }
    }, 420)
  }

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    setBooting(true)
    playDeployTick()
    runBootSequence(() => dispatch({ type: 'START_GAME' }))
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    setBooting(true)
    runBootSequence(() => dispatch({ type: 'CONTINUE_GAME' }))
  }

  function handleResetConfirmed() {
    setConfirmResetOpen(false)
    dispatch({ type: 'RESET_PROGRESS' })
    setBootLines(BOOT_SEQUENCE)
    setBooting(false)
  }

  return (
    <div className="boot-screen app-shell">
      <div className="boot-topbar row">
        <SoundButton />
      </div>

      <div className="boot-content">
        <p className="boot-eyebrow mono">{PROJECT.repoName}</p>
        <h1 className="boot-title">Zuku Fixed the Birthday</h1>
        <p className="boot-subtitle">Una build especial para Zuku falló antes del deploy. Es hora de repararla.</p>

        <ConsolePanel title="boot" lines={bootLines} />

        <form className="boot-actions" onSubmit={canContinue ? handleContinue : handleStart}>
          <button type="submit" className="btn btn-primary boot-main-btn" disabled={booting}>
            {canContinue ? 'CONTINUE BUILD' : 'START'}
          </button>

          {canContinue && (
            <button
              type="button"
              className="btn btn-ghost"
              disabled={booting}
              onClick={() => setConfirmResetOpen(true)}
            >
              RESET PROGRESS
            </button>
          )}
        </form>
      </div>

      <ConfirmModal
        open={confirmResetOpen}
        title="¿Reiniciar el progreso?"
        message="Se van a borrar todos los fixes completados. Esta acción no se puede deshacer."
        confirmLabel="Sí, reiniciar"
        cancelLabel="Cancelar"
        onConfirm={handleResetConfirmed}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  )
}
