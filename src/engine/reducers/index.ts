import type { MatterData, SavedState, GameAction } from '../types'
import { createInitialState } from '../state'

/**
 * Root reducer for the game engine.
 * Takes the current state and an action, returns the new state.
 * All reducers are pure functions with no side effects.
 */
export function rootReducer(
  matter: MatterData,
  state: SavedState,
  action: GameAction
): SavedState {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload }

    case 'resetState':
      return createInitialState(matter)

    case 'setTopic':
      return {
        ...state,
        active: {
          ...state.active,
          topic: action.payload.topic,
        },
      }

    case 'setTopicItem':
      return {
        ...state,
        active: {
          ...state.active,
          item: {
            ...state.active.item,
            [action.payload.topic]: action.payload.item,
          },
        },
      }

    case 'setLeadScientist':
      return {
        ...state,
        leadScientist: action.payload.scientist,
      }

    case 'updateGeneratorCount':
      return {
        ...state,
        generators: {
          ...state.generators,
          [action.payload.generator]: {
            ...state.generators[action.payload.generator],
            count: action.payload.count,
          },
        },
      }

    case 'purchaseGenerator': {
      const generatorKey = action.payload.generator
      const purchaseCount = action.payload.count
      const generator = matter.generators[generatorKey]
      if (!generator || purchaseCount <= 0) return state

      const currentCount = state.generators[generatorKey]?.count ?? 0
      const multiplier = generator.costMultiplier ?? 1

      // Calculate total cost for purchasing `purchaseCount` generators
      // Cost scales: baseCost * multiplier^currentCount for each purchase
      let totalCosts: Record<string, number> = {}
      for (let i = 0; i < purchaseCount; i++) {
        const scale = Math.pow(multiplier, currentCount + i)
        for (const [itemKey, baseCost] of Object.entries(generator.cost)) {
          totalCosts[itemKey] = (totalCosts[itemKey] ?? 0) + Math.ceil(baseCost * scale)
        }
      }

      // Check if player can afford it
      for (const [itemKey, cost] of Object.entries(totalCosts)) {
        const have = state.items[itemKey]?.count ?? 0
        if (have < cost) return state // Can't afford
      }

      // Deduct costs
      const newItems = { ...state.items }
      for (const [itemKey, cost] of Object.entries(totalCosts)) {
        newItems[itemKey] = {
          ...newItems[itemKey],
          count: (newItems[itemKey]?.count ?? 0) - cost,
        }
      }

      return {
        ...state,
        items: newItems,
        generators: {
          ...state.generators,
          [generatorKey]: {
            ...state.generators[generatorKey],
            count: currentCount + purchaseCount,
          },
        },
      }
    }

    case 'sellGenerator': {
      const generatorKey = action.payload.generator
      const sellCount = action.payload.count
      const generator = matter.generators[generatorKey]
      if (!generator || sellCount <= 0) return state

      const currentCount = state.generators[generatorKey]?.count ?? 0
      if (currentCount < sellCount) return state // Can't sell more than we have

      const multiplier = generator.costMultiplier ?? 1

      // Calculate refund (50% of cost for the generators being sold)
      let refunds: Record<string, number> = {}
      for (let i = 0; i < sellCount; i++) {
        const scale = Math.pow(multiplier, currentCount - 1 - i)
        for (const [itemKey, baseCost] of Object.entries(generator.cost)) {
          refunds[itemKey] = (refunds[itemKey] ?? 0) + Math.floor(baseCost * scale * 0.5)
        }
      }

      // Add refunds
      const newItems = { ...state.items }
      for (const [itemKey, refund] of Object.entries(refunds)) {
        newItems[itemKey] = {
          ...newItems[itemKey],
          count: (newItems[itemKey]?.count ?? 0) + refund,
        }
      }

      return {
        ...state,
        items: newItems,
        generators: {
          ...state.generators,
          [generatorKey]: {
            ...state.generators[generatorKey],
            count: currentCount - sellCount,
          },
        },
      }
    }

    case 'updateItemCount':
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.item]: {
            ...state.items[action.payload.item],
            count: action.payload.count,
          },
        },
      }

    case 'updatePrediction':
      // This is handled separately by the solver
      return state

    case 'tick':
      // This is handled by the simulation module
      return state

    case 'updateSettings':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      }

    case 'purchaseUpgrade': {
      const upgradeKey = action.payload.upgrade
      const upgrade = matter.upgrades[upgradeKey]
      if (!upgrade) return state

      // Already acquired (and not expired)?
      const currentState = state.upgrades[upgradeKey]
      if (currentState?.acquired && (currentState.durability === undefined || currentState.durability > 0)) {
        return state
      }

      // Check if player can afford it
      for (const [itemKey, cost] of Object.entries(upgrade.cost)) {
        const have = state.items[itemKey]?.count ?? 0
        if (have < cost) return state // Can't afford
      }

      // Deduct costs
      const newItems = { ...state.items }
      for (const [itemKey, cost] of Object.entries(upgrade.cost)) {
        newItems[itemKey] = {
          ...newItems[itemKey],
          count: (newItems[itemKey]?.count ?? 0) - cost,
        }
      }

      // Set durability for expiring upgrades (in seconds)
      // This becomes a pseudo-resource consumed by a hidden decay generator
      const durability = upgrade.expiration

      return {
        ...state,
        items: newItems,
        upgrades: {
          ...state.upgrades,
          [upgradeKey]: {
            ...state.upgrades[upgradeKey],
            acquired: true,
            durability,
          },
        },
      }
    }

    default:
      return state
  }
}
