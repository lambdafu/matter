import type { GameEvent, GameEventType, EventListener } from './types'

/**
 * Simple event emitter for game events.
 * Used to notify listeners about achievements, unlocks, etc.
 */
export class EventEmitter {
  private listeners: Map<GameEventType | '*', Set<EventListener>> = new Map()

  /**
   * Subscribe to a specific event type or all events ('*')
   */
  on(eventType: GameEventType | '*', listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(listener)
    }
  }

  /**
   * Emit an event to all relevant listeners
   */
  emit(event: GameEvent): void {
    // Notify specific listeners
    const specificListeners = this.listeners.get(event.type)
    if (specificListeners) {
      for (const listener of specificListeners) {
        listener(event)
      }
    }

    // Notify wildcard listeners
    const wildcardListeners = this.listeners.get('*')
    if (wildcardListeners) {
      for (const listener of wildcardListeners) {
        listener(event)
      }
    }
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.listeners.clear()
  }
}
