import { useGameDispatch, useGameState } from '../context/GameContext'
import { playClick } from '../utils/sound'

export function SoundButton() {
  const state = useGameState()
  const dispatch = useGameDispatch()

  return (
    <button
      type="button"
      className="btn icon-btn btn-ghost"
      onClick={() => {
        dispatch({ type: 'TOGGLE_SOUND' })
        if (!state.soundEnabled) window.setTimeout(playClick, 30)
      }}
      aria-pressed={state.soundEnabled}
      aria-label={state.soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
      title={state.soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
    >
      <span aria-hidden="true">{state.soundEnabled ? '🔊' : '🔇'}</span>
    </button>
  )
}
