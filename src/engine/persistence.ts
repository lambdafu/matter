import type { SavedState } from './types'

/** Storage keys for different save slots */
const STORAGE_KEY_AUTOSAVE = 'matter_autosave'
const STORAGE_KEY_MANUAL = 'matter_manual_save'

// Legacy key for backwards compatibility
const STORAGE_KEY_LEGACY = 'matter_save'

/**
 * Serialize game state to JSON string
 */
export function serialize(state: SavedState): string {
  return JSON.stringify(state)
}

/**
 * Deserialize JSON string to game state
 * Returns undefined if parsing fails
 */
export function deserialize(data: string): Partial<SavedState> | undefined {
  try {
    const parsed = JSON.parse(data)
    if (typeof parsed !== 'object' || parsed === null) {
      return undefined
    }
    return parsed as Partial<SavedState>
  } catch {
    return undefined
  }
}

/**
 * Save state to localStorage (autosave slot)
 */
export function saveToLocalStorage(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY_AUTOSAVE, serialize(state))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Load state from localStorage (autosave slot, with legacy fallback)
 */
export function loadFromLocalStorage(): Partial<SavedState> | undefined {
  try {
    // Try autosave slot first
    let data = localStorage.getItem(STORAGE_KEY_AUTOSAVE)

    // Fall back to legacy slot for backwards compatibility
    if (data === null) {
      data = localStorage.getItem(STORAGE_KEY_LEGACY)
      // Migrate legacy save to autosave slot
      if (data !== null) {
        localStorage.setItem(STORAGE_KEY_AUTOSAVE, data)
        localStorage.removeItem(STORAGE_KEY_LEGACY)
      }
    }

    if (data === null) {
      return undefined
    }
    return deserialize(data)
  } catch {
    return undefined
  }
}

/**
 * Clear autosave from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_AUTOSAVE)
  } catch {
    // Silently fail
  }
}

/**
 * Save state to manual save slot (separate from autosave)
 */
export function saveToManualSlot(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY_MANUAL, serialize(state))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Load state from manual save slot
 */
export function loadFromManualSlot(): Partial<SavedState> | undefined {
  try {
    const data = localStorage.getItem(STORAGE_KEY_MANUAL)
    if (data === null) {
      return undefined
    }
    return deserialize(data)
  } catch {
    return undefined
  }
}

/**
 * Check if a manual save exists
 */
export function hasManualSave(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_MANUAL) !== null
  } catch {
    return false
  }
}
