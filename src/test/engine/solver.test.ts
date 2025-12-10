import { describe, it, expect, beforeEach } from 'vitest'
import { createGame } from '../../engine'
import type { Game } from '../../engine'
import matter from '../../engine/data'

describe('LP Solver', () => {
  let game: Game

  beforeEach(() => {
    game = createGame(matter)
  })

  describe('updatePrediction', () => {
    it('calculates prediction with no generators', () => {
      game.dispatch({ type: 'updatePrediction' })
      const state = game.getState()

      expect(state.prediction).toBeDefined()
      expect(state.prediction!.result.items.photon.delta).toBe(0)
    })

    it('calculates positive production with flashlight', () => {
      // Add 1 flashlight (produces 1 photon per tick)
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 1 } })
      game.dispatch({ type: 'updatePrediction' })

      const state = game.getState()
      expect(state.prediction).toBeDefined()
      expect(state.prediction!.result.items.photon.delta).toBeGreaterThan(0)
      expect(state.prediction!.result.generators.flashlight.utilization).toBe(1) // Full utilization
    })

    it('calculates production with multiple flashlights', () => {
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 10 } })
      game.dispatch({ type: 'updatePrediction' })

      const state = game.getState()
      expect(state.prediction!.result.items.photon.delta).toBe(10) // 10 flashlights * 1 photon each
    })

    it('limits solar panel utilization by photon inventory', () => {
      // Solar panel needs 100 photons to produce 1 electron
      // With 0 photons, it should have 0 utilization
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'solarpanel', count: 1 } })
      game.dispatch({ type: 'updatePrediction' })

      const state = game.getState()
      expect(state.prediction!.result.generators.solarpanel.utilization).toBe(0)
    })

    it('allows solar panel production with sufficient photons', () => {
      // Give enough photons for solar panel to run
      game.dispatch({ type: 'updateItemCount', payload: { item: 'photon', count: 100 } })
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'solarpanel', count: 1 } })
      game.dispatch({ type: 'updatePrediction' })

      const state = game.getState()
      expect(state.prediction!.result.generators.solarpanel.utilization).toBe(1)
      expect(state.prediction!.result.items.electron.delta).toBe(1)
    })

    it('balances production chain', () => {
      // Set up a production chain: flashlights produce photons, solar panels consume them
      // 1 flashlight produces 1 photon, solar panel needs 100 photons
      // So we need 100 flashlights to sustain 1 solar panel at full capacity
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 100 } })
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'solarpanel', count: 1 } })
      // Give initial inventory to bootstrap
      game.dispatch({ type: 'updateItemCount', payload: { item: 'photon', count: 100 } })
      game.dispatch({ type: 'updatePrediction' })

      const state = game.getState()
      // Photon delta should be net 0 (100 produced - 100 consumed)
      expect(state.prediction!.result.items.photon.delta).toBeCloseTo(0, 5)
      // Electron production should be 1
      expect(state.prediction!.result.items.electron.delta).toBe(1)
    })
  })
})
