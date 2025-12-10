import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, ReactNode } from 'react'
import { createGame, loadFromLocalStorage, saveToLocalStorage, saveToManualSlot, loadFromManualSlot } from '../../engine'
import type { Game, SavedState, GameAction, MatterData } from '../../engine'
import matter from '../../engine/data'

interface GameContextValue {
  game: Game
  state: SavedState
  matter: MatterData
  dispatch: (action: GameAction) => void
  /** Manual save to separate slot (for debugging/testing) */
  manualSave: () => void
  /** Manual load from separate slot (for debugging/testing) */
  manualLoad: () => void
  reset: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

interface GameProviderProps {
  children: ReactNode
}

/** Autosave interval in milliseconds (every 10 seconds) */
const AUTOSAVE_INTERVAL = 10000

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

  // Track if state has changed since last autosave
  const lastSavedStateRef = useRef<string>(JSON.stringify(game.getState()))

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

  // Autosave every AUTOSAVE_INTERVAL ms (only if state changed)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentState = game.getState()
      const currentStateStr = JSON.stringify(currentState)

      if (currentStateStr !== lastSavedStateRef.current) {
        saveToLocalStorage(currentState)
        lastSavedStateRef.current = currentStateStr
      }
    }, AUTOSAVE_INTERVAL)

    return () => clearInterval(intervalId)
  }, [game])

  // Save on page unload (beforeunload event)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage(game.getState())
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [game])

  // Dispatch wrapper
  const dispatch = useCallback((action: GameAction) => {
    game.dispatch(action)
  }, [game])

  // Manual save to separate slot (for debugging/testing)
  const manualSave = useCallback(() => {
    saveToManualSlot(game.getState())
  }, [game])

  // Manual load from separate slot (for debugging/testing)
  const manualLoad = useCallback(() => {
    const saved = loadFromManualSlot()
    if (saved) {
      game.load(JSON.stringify(saved))
      // Recalculate prediction so game loop works correctly
      game.dispatch({ type: 'updatePrediction' })
      // Update autosave reference so we don't immediately overwrite
      lastSavedStateRef.current = JSON.stringify(game.getState())
    }
  }, [game])

  // Reset game
  const reset = useCallback(() => {
    game.dispatch({ type: 'resetState' })
    // Recalculate prediction so game loop starts ticking again
    game.dispatch({ type: 'updatePrediction' })
    // Clear autosave reference so the fresh state gets saved
    lastSavedStateRef.current = ''
  }, [game])

  const value: GameContextValue = {
    game,
    state,
    matter,
    dispatch,
    manualSave,
    manualLoad,
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
