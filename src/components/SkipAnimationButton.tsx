import { useGameDispatch, useGameState } from '../context/GameContext'

export function SkipAnimationButton() {
  const state = useGameState()
  const dispatch = useGameDispatch()

  return (
    <button
      type="button"
      className="btn icon-btn btn-ghost"
      onClick={() => dispatch({ type: 'TOGGLE_SKIP_ANIMATIONS' })}
      aria-pressed={state.skipAnimations}
      aria-label={state.skipAnimations ? 'Activar animaciones' : 'Omitir animaciones'}
      title={state.skipAnimations ? 'Activar animaciones' : 'Omitir animaciones'}
    >
      <span aria-hidden="true">{state.skipAnimations ? '▶' : '⏭'}</span>
    </button>
  )
}
