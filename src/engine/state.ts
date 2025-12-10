import type {
  MatterData,
  SavedState,
  ItemState,
  GeneratorState,
  UpgradeState,
  NarrativeState,
} from './types'

/**
 * Create the initial narrative state.
 */
function createInitialNarrativeState(): NarrativeState {
  return {
    triggered: [],
    lastEventTime: 0,
    gameTime: 0,
    messageLog: [],
    modalQueue: [],
  }
}

/**
 * Create the initial saved state from game data.
 * This initializes all items, generators, and upgrades to their default states.
 */
export function createInitialState(matter: MatterData): SavedState {
  const items: Record<string, ItemState> = {}
  for (const key of Object.keys(matter.items)) {
    items[key] = { available: false, count: 0 }
  }

  const generators: Record<string, GeneratorState> = {}
  for (const key of Object.keys(matter.generators)) {
    generators[key] = { visible: false, available: false, count: 0 }
  }

  const upgrades: Record<string, UpgradeState> = {}
  for (const key of Object.keys(matter.upgrades)) {
    upgrades[key] = { visible: false, available: false, acquired: false }
  }

  return {
    version: 1,
    leadScientist: 'curie',
    unlockedScientists: [], // Scientists are unlocked via narrative events
    active: {
      topic: 'sm',
      item: { sm: 'photon', pt: 'Cu' },
    },
    settings: {
      numberFormat: 'scientific',
    },
    items,
    generators,
    upgrades,
    narrative: createInitialNarrativeState(),
  }
}

/**
 * Merge saved state with initial state to handle new items/generators/upgrades
 * added since the save was created.
 *
 * The merge strategy is:
 * - Start with initial state (has all current game entities)
 * - Overlay saved state on top (preserves player progress)
 * - This ensures new items/generators/upgrades are included with default state
 *   while existing progress is preserved
 *
 * For debugging: if you suspect merge issues, check that:
 * 1. `initial` contains all current matter entities
 * 2. `saved` contains only entities that existed when save was created
 * 3. Result should have all of `initial`'s keys with `saved`'s values where they exist
 */
export function mergeState(
  initial: SavedState,
  saved: Partial<SavedState>
): SavedState {
  // Log merge info in development
  if (import.meta.env.DEV) {
    const initialUpgradeKeys = Object.keys(initial.upgrades)
    const savedUpgradeKeys = Object.keys(saved.upgrades ?? {})
    const newUpgrades = initialUpgradeKeys.filter(k => !savedUpgradeKeys.includes(k))
    if (newUpgrades.length > 0) {
      console.log('[Matter] New upgrades added since last save:', newUpgrades)
    }
    const newItems = Object.keys(initial.items).filter(k => !Object.keys(saved.items ?? {}).includes(k))
    if (newItems.length > 0) {
      console.log('[Matter] New items added since last save:', newItems)
    }
    const newGenerators = Object.keys(initial.generators).filter(k => !Object.keys(saved.generators ?? {}).includes(k))
    if (newGenerators.length > 0) {
      console.log('[Matter] New generators added since last save:', newGenerators)
    }
  }

  return {
    ...initial,
    ...saved,
    active: {
      ...initial.active,
      ...saved.active,
      item: {
        ...initial.active.item,
        ...saved.active?.item,
      },
    },
    settings: {
      ...initial.settings,
      ...saved.settings,
    },
    items: {
      ...initial.items,
      ...saved.items,
    },
    generators: {
      ...initial.generators,
      ...saved.generators,
    },
    upgrades: {
      ...initial.upgrades,
      ...saved.upgrades,
    },
    narrative: {
      ...initial.narrative,
      ...saved.narrative,
    },
  }
}
