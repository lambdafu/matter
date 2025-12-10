import type { SavedState } from './types'

const STORAGE_KEY = 'matter_save'

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
 * Save state to localStorage
 */
export function saveToLocalStorage(state: SavedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialize(state))
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Load state from localStorage
 */
export function loadFromLocalStorage(): Partial<SavedState> | undefined {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data === null) {
      return undefined
    }
    return deserialize(data)
  } catch {
    return undefined
  }
}

/**
 * Clear saved state from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail
  }
}
