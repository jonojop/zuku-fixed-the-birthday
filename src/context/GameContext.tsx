import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { gameReducer, createInitialState, type GameAction } from './gameReducer'
import { loadState, saveState } from './persistence'
import type { GameState } from '../types/game'

function init(): GameState {
  return loadState() ?? createInitialState()
}

const GameStateContext = createContext<GameState | null>(null)
const GameDispatchContext = createContext<Dispatch<GameAction> | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, init)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('skip-animations', state.skipAnimations)
  }, [state.skipAnimations])

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>{children}</GameDispatchContext.Provider>
    </GameStateContext.Provider>
  )
}

export function useGameState(): GameState {
  const ctx = useContext(GameStateContext)
  if (!ctx) throw new Error('useGameState must be used within GameProvider')
  return ctx
}

export function useGameDispatch(): Dispatch<GameAction> {
  const ctx = useContext(GameDispatchContext)
  if (!ctx) throw new Error('useGameDispatch must be used within GameProvider')
  return ctx
}
