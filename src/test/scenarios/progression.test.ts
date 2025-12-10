import { describe, it, expect } from 'vitest'
import { createGame } from '../../engine'
import type { SavedState, GameAction } from '../../engine'
import matter from '../../engine/data'

describe('Game Progression Scenarios', () => {
  describe('Basic photon production', () => {
    it('player can produce photons with flashlight', () => {
      const game = createGame(matter)

      // Start with nothing
      expect(game.getState().items.photon.count).toBe(0)

      // Buy a flashlight
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 1 } })

      // Run prediction and simulate time
      game.dispatch({ type: 'updatePrediction' })

      // Simulate 10 seconds
      game.tick(10000)

      // Should have produced photons
      expect(game.getState().items.photon.count).toBe(10)
    })

    it('player can produce electrons from photons', () => {
      const game = createGame(matter)

      // Set up: 100 photons and 1 solar panel
      game.dispatch({ type: 'updateItemCount', payload: { item: 'photon', count: 1000 } })
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'solarpanel', count: 1 } })
      game.dispatch({ type: 'updatePrediction' })

      // Simulate 10 seconds - solar panel produces 1 electron/s from 100 photons/s
      game.tick(10000)

      expect(game.getState().items.electron.count).toBe(10)
      expect(game.getState().items.photon.count).toBe(0) // All consumed
    })
  })

  describe('Full production chain', () => {
    it('sustained production with balanced chain', () => {
      const game = createGame(matter)

      // Set up: 100 flashlights producing 100 photons/s
      // 1 solar panel consuming 100 photons/s, producing 1 electron/s
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 100 } })
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'solarpanel', count: 1 } })
      // Give starting inventory to bootstrap
      game.dispatch({ type: 'updateItemCount', payload: { item: 'photon', count: 100 } })
      game.dispatch({ type: 'updatePrediction' })

      // Simulate 100 seconds
      for (let i = 0; i < 100; i++) {
        game.tick(1000)
      }

      // Photons should stay around 100 (balanced)
      expect(game.getState().items.photon.count).toBeCloseTo(100, 0)
      // Electrons should have accumulated
      expect(game.getState().items.electron.count).toBe(100)
    })
  })

  describe('Headless simulation', () => {
    it('can run extended simulation without UI', () => {
      const game = createGame(matter)
      const events: string[] = []

      // Subscribe to track all state changes
      game.subscribe((_state: SavedState, action: GameAction) => {
        events.push(action.type)
      })

      // Set up production
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 10 } })
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'laser', count: 1 } })
      game.dispatch({ type: 'updatePrediction' })

      // Run 1000 ticks (simulating ~16 minutes at 1 tick/second)
      const startPhotons = game.getState().items.photon.count
      for (let i = 0; i < 1000; i++) {
        game.tick(1000)
      }

      // Verify simulation ran
      const endPhotons = game.getState().items.photon.count
      expect(endPhotons).toBeGreaterThan(startPhotons)

      // 10 flashlights * 1 + 1 laser * 10000 = 10010 photons/second
      expect(endPhotons).toBe(10010 * 1000)

      // Verify events were logged
      expect(events.filter(e => e === 'tick').length).toBe(1000)
    })

    it('can observe state changes during simulation', () => {
      const game = createGame(matter)
      const photonHistory: number[] = []

      game.subscribe((state: SavedState) => {
        photonHistory.push(state.items.photon.count)
      })

      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 5 } })
      game.dispatch({ type: 'updatePrediction' })

      // Run 10 ticks
      for (let i = 0; i < 10; i++) {
        game.tick(1000)
      }

      // Should have 12 entries: 1 for generator update, 1 for prediction, 10 for ticks
      expect(photonHistory.length).toBe(12)

      // Photon count should increase
      expect(photonHistory[photonHistory.length - 1]).toBe(50)
    })
  })
})
