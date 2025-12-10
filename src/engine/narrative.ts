import type {
  MatterData,
  SavedState,
  NarrativeCondition,
  NarrativeEffect,
  NarrativeEvent,
  NarrativeLogEntry,
} from './types'

/**
 * Evaluate a single narrative condition against the current state.
 */
export function evaluateCondition(
  condition: NarrativeCondition,
  state: SavedState
): boolean {
  const { type, key, op, value } = condition

  let actualValue: number | boolean

  switch (type) {
    case 'item':
      if (!key) return false
      actualValue = state.items[key]?.count ?? 0
      break

    case 'generator':
      if (!key) return false
      actualValue = state.generators[key]?.count ?? 0
      break

    case 'upgrade':
      if (!key) return false
      // 'has' checks if upgrade is acquired and not expired
      const upgradeState = state.upgrades[key]
      if (op === 'has') {
        const isAcquired = upgradeState?.acquired ?? false
        const isExpired = upgradeState?.durability !== undefined && upgradeState.durability <= 0
        actualValue = isAcquired && !isExpired
        return actualValue === value
      }
      // Numeric check on durability
      actualValue = upgradeState?.durability ?? 0
      break

    case 'event':
      if (!key) return false
      // Check if an event has been triggered
      actualValue = state.narrative.triggered.includes(key)
      return actualValue === value

    case 'gameTime':
      actualValue = state.narrative.gameTime
      break

    default:
      return false
  }

  // Numeric comparisons
  if (typeof actualValue === 'number' && typeof value === 'number') {
    switch (op) {
      case '>=': return actualValue >= value
      case '>': return actualValue > value
      case '<=': return actualValue <= value
      case '<': return actualValue < value
      case '==': return actualValue === value
      default: return false
    }
  }

  return false
}

/**
 * Check which narrative events should trigger given the current state.
 * Returns events that have all conditions met and haven't been triggered yet.
 */
export function checkNarrativeEvents(
  matter: MatterData,
  state: SavedState
): NarrativeEvent[] {
  const toTrigger: NarrativeEvent[] = []

  for (const event of matter.narrative) {
    // Skip already triggered events
    if (state.narrative.triggered.includes(event.key)) continue

    // Check cooldown (minimum time since last event)
    if (event.cooldown !== undefined) {
      const timeSinceLast = state.narrative.gameTime - state.narrative.lastEventTime
      if (timeSinceLast < event.cooldown) continue
    }

    // Check minimum game time
    if (event.minGameTime !== undefined) {
      if (state.narrative.gameTime < event.minGameTime) continue
    }

    // Check all conditions
    const allConditionsMet = event.conditions.every(cond =>
      evaluateCondition(cond, state)
    )

    if (allConditionsMet) {
      toTrigger.push(event)
    }
  }

  return toTrigger
}

/**
 * Apply a single narrative effect to the state.
 */
export function applyEffect(
  effect: NarrativeEffect,
  state: SavedState
): SavedState {
  const { type, key, count = 1 } = effect

  switch (type) {
    case 'grantItem':
      return {
        ...state,
        items: {
          ...state.items,
          [key]: {
            ...state.items[key],
            available: true,
            count: (state.items[key]?.count ?? 0) + count,
          },
        },
      }

    case 'grantGenerator':
      return {
        ...state,
        generators: {
          ...state.generators,
          [key]: {
            ...state.generators[key],
            visible: true,
            available: true,
            count: (state.generators[key]?.count ?? 0) + count,
          },
        },
      }

    case 'unlockItem':
      return {
        ...state,
        items: {
          ...state.items,
          [key]: {
            ...state.items[key],
            available: true,
          },
        },
      }

    case 'unlockGenerator':
      return {
        ...state,
        generators: {
          ...state.generators,
          [key]: {
            ...state.generators[key],
            visible: true,
            available: true,
          },
        },
      }

    case 'unlockUpgrade':
      return {
        ...state,
        upgrades: {
          ...state.upgrades,
          [key]: {
            ...state.upgrades[key],
            visible: true,
            available: true,
          },
        },
      }

    case 'revealGenerator':
      return {
        ...state,
        generators: {
          ...state.generators,
          [key]: {
            ...state.generators[key],
            visible: true,
            // available stays false - it's just a teaser
          },
        },
      }

    case 'revealUpgrade':
      return {
        ...state,
        upgrades: {
          ...state.upgrades,
          [key]: {
            ...state.upgrades[key],
            visible: true,
            // available stays false - it's just a teaser
          },
        },
      }

    case 'removeItem':
      return {
        ...state,
        items: {
          ...state.items,
          [key]: {
            ...state.items[key],
            count: Math.max(0, (state.items[key]?.count ?? 0) - count),
          },
        },
      }

    case 'removeGenerator':
      return {
        ...state,
        generators: {
          ...state.generators,
          [key]: {
            ...state.generators[key],
            count: Math.max(0, (state.generators[key]?.count ?? 0) - count),
          },
        },
      }

    case 'unlockScientist':
      // Add scientist to unlocked list and queue celebration modal
      if (state.unlockedScientists.includes(key)) {
        return state // Already unlocked
      }
      return {
        ...state,
        unlockedScientists: [...state.unlockedScientists, key],
        narrative: {
          ...state.narrative,
          modalQueue: [...state.narrative.modalQueue, { type: 'scientistUnlock', key }],
        },
      }

    default:
      return state
  }
}

/**
 * Apply all effects of a narrative event and update narrative state.
 */
export function applyNarrativeEvent(
  event: NarrativeEvent,
  state: SavedState
): SavedState {
  // Apply all effects
  let newState = state
  for (const effect of event.effects) {
    newState = applyEffect(effect, newState)
  }

  // Create log entry
  const logEntry: NarrativeLogEntry = {
    eventKey: event.key,
    timestamp: newState.narrative.gameTime,
    message: event.message,
    speaker: event.speaker,
  }

  // Update narrative state
  const newModalQueue = event.modal
    ? [...newState.narrative.modalQueue, { type: 'narrative' as const, key: event.key }]
    : newState.narrative.modalQueue

  newState = {
    ...newState,
    narrative: {
      ...newState.narrative,
      triggered: [...newState.narrative.triggered, event.key],
      lastEventTime: newState.narrative.gameTime,
      messageLog: [...newState.narrative.messageLog, logEntry].slice(-50), // Keep last 50 messages
      modalQueue: newModalQueue,
    },
  }

  return newState
}

/**
 * Process all pending narrative events.
 * Returns the updated state and list of triggered events.
 */
export function processNarrativeEvents(
  matter: MatterData,
  state: SavedState
): { state: SavedState; triggered: NarrativeEvent[] } {
  const events = checkNarrativeEvents(matter, state)
  let newState = state
  const triggered: NarrativeEvent[] = []

  // Process events one at a time (respecting cooldowns between them)
  for (const event of events) {
    // Re-check if this event should still trigger (previous events may have changed state)
    const stillValid = event.conditions.every(cond =>
      evaluateCondition(cond, newState)
    )

    if (stillValid && !newState.narrative.triggered.includes(event.key)) {
      newState = applyNarrativeEvent(event, newState)
      triggered.push(event)

      // If this event has a cooldown, stop processing more events this tick
      // (they'll be picked up next tick)
      if (event.cooldown !== undefined && event.cooldown > 0) {
        break
      }
    }
  }

  return { state: newState, triggered }
}
