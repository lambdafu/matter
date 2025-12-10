import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { createGame, loadFromLocalStorage, saveToLocalStorage } from '../../engine'
import type { Game, SavedState, GameAction, MatterData } from '../../engine'
import matter from '../../engine/data'

interface GameContextValue {
  game: Game
  state: SavedState
  matter: MatterData
  dispatch: (action: GameAction) => void
  save: () => void
  load: () => void
  reset: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

interface GameProviderProps {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  // Create game instance once
  const game = useMemo(() => createGame(matter), [])

  // State that triggers re-renders
  const [state, setState] = useState<SavedState>(() => {
    // Try to load from localStorage on init
    const saved = loadFromLocalStorage()
    if (saved) {
      game.load(JSON.stringify(saved))
    }
    // Run initial prediction
    game.dispatch({ type: 'updatePrediction' })
    return game.getState()
  })

  // Subscribe to game state changes
  useEffect(() => {
    const unsubscribe = game.subscribe((newState: SavedState) => {
      setState(newState)
    })
    return unsubscribe
  }, [game])

  // Game loop - run ticks automatically (10 times per second)
  useEffect(() => {
    const TICK_INTERVAL = 100 // ms

    const intervalId = setInterval(() => {
      // Only tick if we have a prediction (generators set up)
      if (game.getState().prediction) {
        game.tick(TICK_INTERVAL)
      }
    }, TICK_INTERVAL)

    return () => clearInterval(intervalId)
  }, [game])

  // Dispatch wrapper
  const dispatch = useCallback((action: GameAction) => {
    game.dispatch(action)
  }, [game])

  // Save to localStorage
  const save = useCallback(() => {
    saveToLocalStorage(game.getState())
  }, [game])

  // Load from localStorage
  const load = useCallback(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      game.load(JSON.stringify(saved))
    }
  }, [game])

  // Reset game
  const reset = useCallback(() => {
    game.dispatch({ type: 'resetState' })
  }, [game])

  const value: GameContextValue = {
    game,
    state,
    matter,
    dispatch,
    save,
    load,
    reset,
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

/**
 * Hook to access the full game context
 */
export function useGame(): GameContextValue {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

/**
 * Hook to select specific parts of game state (for performance)
 */
export function useGameState<T>(selector: (state: SavedState) => T): T {
  const { state } = useGame()
  return selector(state)
}

/**
 * Hook to access static game data
 */
export function useMatter(): MatterData {
  const { matter } = useGame()
  return matter
}

/**
 * Hook to dispatch game actions
 */
export function useDispatch(): (action: GameAction) => void {
  const { dispatch } = useGame()
  return dispatch
}
