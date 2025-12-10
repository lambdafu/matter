import type {
  MatterData,
  SavedState,
  GameAction,
  Game,
  StateListener,
  EventListener,
  GameEventType,
  Prediction,
  NarrativeEvent,
} from './types'
import { createInitialState, mergeState } from './state'
import { rootReducer } from './reducers'
import { EventEmitter } from './events'
import { serialize, deserialize } from './persistence'
import { solvePrediction } from './solver'
import { processNarrativeEvents } from './narrative'

export type { Game, MatterData, SavedState, GameAction }

/**
 * Create a new game instance with the given game data.
 */
export function createGame(matter: MatterData): Game {
  let state = createInitialState(matter)
  const stateListeners = new Set<StateListener>()
  const eventEmitter = new EventEmitter()

  function getState(): SavedState {
    return state
  }

  function getMatter(): MatterData {
    return matter
  }

  function dispatch(action: GameAction): void {
    const prevState = state
    let narrativeEvents: NarrativeEvent[] = []

    // Handle special actions
    if (action.type === 'updatePrediction') {
      const prediction = solvePrediction(matter, state)
      state = { ...state, prediction }
    } else if (action.type === 'tick') {
      // Simulation tick - calculate production and narrative
      const result = simulateTick(matter, state, action.payload.dt)
      state = result.state
      narrativeEvents = result.narrativeEvents
    } else if (action.type === 'dismissNarrativeModal') {
      // Clear current modal
      state = {
        ...state,
        narrative: {
          ...state.narrative,
          currentModal: null,
        },
      }
    } else if (action.type === 'resetState') {
      // Reset state and immediately process narrative events
      // This ensures the welcome event triggers without waiting for a tick
      state = rootReducer(matter, state, action)
      const { state: stateAfterNarrative, triggered } = processNarrativeEvents(matter, state)
      state = stateAfterNarrative
      narrativeEvents = triggered
    } else {
      // Normal reducer
      state = rootReducer(matter, state, action)
    }

    // Notify state listeners
    for (const listener of stateListeners) {
      listener(state, action, prevState)
    }

    // Emit state change event
    eventEmitter.emit({
      type: 'stateChange',
      action,
      prevState,
      nextState: state,
    })

    // Emit narrative events
    for (const event of narrativeEvents) {
      eventEmitter.emit({
        type: 'narrativeEvent',
        event,
      })
    }
  }

  function subscribe(listener: StateListener): () => void {
    stateListeners.add(listener)
    return () => {
      stateListeners.delete(listener)
    }
  }

  function on(eventType: GameEventType, listener: EventListener): () => void {
    return eventEmitter.on(eventType, listener)
  }

  function save(): string {
    return serialize(state)
  }

  function load(data: string): void {
    const loaded = deserialize(data)
    if (loaded) {
      const initial = createInitialState(matter)
      state = mergeState(initial, loaded)

      // Process any pending narrative events (for fresh saves or after reset)
      const { state: stateAfterNarrative, triggered } = processNarrativeEvents(matter, state)
      state = stateAfterNarrative

      // Notify listeners of load
      for (const listener of stateListeners) {
        listener(state, { type: 'setState', payload: state }, state)
      }

      // Emit narrative events
      for (const event of triggered) {
        eventEmitter.emit({
          type: 'narrativeEvent',
          event,
        })
      }
    }
  }

  function tick(dt: number): void {
    dispatch({ type: 'tick', payload: { dt } })
  }

  return {
    getState,
    getMatter,
    dispatch,
    subscribe,
    on,
    save,
    load,
    tick,
  }
}

/**
 * Simulate one tick of game time.
 *
 * This function handles:
 * 1. Game time tracking for narrative system
 * 2. Item count updates based on prediction deltas
 * 3. Upgrade durability decay (pseudo-resource consumption)
 * 4. Breakpoint detection for re-solving when state changes qualitatively
 * 5. Narrative event processing
 *
 * The tick may be split if a breakpoint occurs during the tick interval.
 * When a breakpoint is reached, the state changes and a re-solve is needed.
 *
 * Returns both the new state and any triggered narrative events.
 */
function simulateTick(
  matter: MatterData,
  state: SavedState,
  dt: number
): { state: SavedState; narrativeEvents: NarrativeEvent[] } {
  let tickSeconds = dt / 1000
  let needsResolve = false

  // Update game time for narrative tracking
  let newState: SavedState = {
    ...state,
    narrative: {
      ...state.narrative,
      gameTime: state.narrative.gameTime + tickSeconds,
    },
  }

  // If no prediction, just update game time and check narrative
  if (!state.prediction) {
    const { state: stateAfterNarrative, triggered } = processNarrativeEvents(matter, newState)
    return { state: stateAfterNarrative, narrativeEvents: triggered }
  }

  const prediction = state.prediction as Prediction

  // Check if we'll hit a breakpoint during this tick
  if (prediction.nextBreakpoint && prediction.nextBreakpoint.timeUntil <= tickSeconds) {
    // Clamp the tick to the breakpoint
    tickSeconds = prediction.nextBreakpoint.timeUntil
    needsResolve = true
  }

  // Calculate item deltas based on prediction
  const newItems = { ...newState.items }

  for (const [itemKey, itemPrediction] of Object.entries(prediction.result.items)) {
    const currentCount = newState.items[itemKey]?.count ?? 0
    const delta = itemPrediction.delta * tickSeconds
    const newCount = Math.max(0, currentCount + delta)

    newItems[itemKey] = {
      ...newState.items[itemKey],
      count: newCount,
    }
  }

  // Decay upgrade durabilities (pseudo-resource consumption by hidden decay generators)
  // Durability decreases at 1 unit per second for active temporary upgrades
  const newUpgrades = { ...newState.upgrades }
  let upgradeChanged = false

  for (const [upgradeKey, upgradeState] of Object.entries(newState.upgrades)) {
    if (!upgradeState.acquired) continue
    if (upgradeState.durability === undefined) continue // Permanent upgrade

    const newDurability = Math.max(0, upgradeState.durability - tickSeconds)

    if (newDurability !== upgradeState.durability) {
      newUpgrades[upgradeKey] = {
        ...upgradeState,
        durability: newDurability,
      }
      upgradeChanged = true

      // If durability just hit zero, we need to re-solve
      if (newDurability <= 0 && upgradeState.durability > 0) {
        needsResolve = true
      }
    }
  }

  newState = {
    ...newState,
    items: newItems,
    upgrades: upgradeChanged ? newUpgrades : newState.upgrades,
  }

  // If we hit a breakpoint, we need to re-solve the LP problem
  // The new prediction will account for the changed state (depleted resource, expired upgrade)
  if (needsResolve) {
    const newPrediction = solvePrediction(matter, newState)
    newState = { ...newState, prediction: newPrediction }
  }

  // Process narrative events
  const { state: stateAfterNarrative, triggered } = processNarrativeEvents(matter, newState)

  return { state: stateAfterNarrative, narrativeEvents: triggered }
}

// Re-export types and utilities
export { createInitialState, mergeState } from './state'
export { serialize, deserialize, saveToLocalStorage, loadFromLocalStorage, clearLocalStorage, saveToManualSlot, loadFromManualSlot, hasManualSave } from './persistence'
export { solvePrediction } from './solver'
export { EventEmitter } from './events'
export { formatCompact, formatRate } from './format'
export { evaluateCondition, checkNarrativeEvents, applyNarrativeEvent, processNarrativeEvents } from './narrative'
export type { FormatStyle } from './format'
export * from './types'
