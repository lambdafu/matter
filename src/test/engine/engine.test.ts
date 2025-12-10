import { describe, it, expect, beforeEach } from 'vitest'
import { createGame } from '../../engine'
import type { Game, SavedState, GameAction } from '../../engine'
import matter from '../../engine/data'

describe('Game Engine', () => {
  let game: Game

  beforeEach(() => {
    game = createGame(matter)
  })

  describe('createGame', () => {
    it('creates a game with initial state', () => {
      const state = game.getState()
      expect(state.version).toBe(1)
      expect(state.leadScientist).toBe('curie')
      expect(state.active.topic).toBe('sm')
    })

    it('initializes all items with count 0', () => {
      const state = game.getState()
      expect(state.items.photon.count).toBe(0)
      expect(state.items.electron.count).toBe(0)
      expect(state.items.H.count).toBe(0)
    })

    it('initializes all generators with count 0', () => {
      const state = game.getState()
      expect(state.generators.flashlight.count).toBe(0)
      expect(state.generators.laser.count).toBe(0)
    })

    it('provides access to static game data', () => {
      const matterData = game.getMatter()
      expect(matterData.generators.flashlight.name).toBe('Flashlight')
      expect(matterData.items.photon.name).toBe('Photon')
    })
  })

  describe('dispatch actions', () => {
    it('updates generator count', () => {
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 5 } })
      expect(game.getState().generators.flashlight.count).toBe(5)
    })

    it('updates item count', () => {
      game.dispatch({ type: 'updateItemCount', payload: { item: 'photon', count: 100 } })
      expect(game.getState().items.photon.count).toBe(100)
    })

    it('changes active topic', () => {
      game.dispatch({ type: 'setTopic', payload: { topic: 'pt' } })
      expect(game.getState().active.topic).toBe('pt')
    })

    it('changes active item for topic', () => {
      game.dispatch({ type: 'setTopicItem', payload: { topic: 'sm', item: 'electron' } })
      expect(game.getState().active.item.sm).toBe('electron')
    })

    it('changes lead scientist', () => {
      game.dispatch({ type: 'setLeadScientist', payload: { scientist: 'einstein' } })
      expect(game.getState().leadScientist).toBe('einstein')
    })

    it('resets state', () => {
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 5 } })
      game.dispatch({ type: 'resetState' })
      expect(game.getState().generators.flashlight.count).toBe(0)
    })
  })

  describe('state subscriptions', () => {
    it('notifies subscribers on state change', () => {
      const changes: { state: SavedState; action: GameAction }[] = []
      game.subscribe((state, action) => {
        changes.push({ state, action })
      })

      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 3 } })

      expect(changes.length).toBe(1)
      expect(changes[0].action.type).toBe('updateGeneratorCount')
      expect(changes[0].state.generators.flashlight.count).toBe(3)
    })

    it('allows unsubscribing', () => {
      const changes: SavedState[] = []
      const unsubscribe = game.subscribe((state) => {
        changes.push(state)
      })

      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 1 } })
      unsubscribe()
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 2 } })

      expect(changes.length).toBe(1)
    })
  })

  describe('save/load', () => {
    it('serializes and deserializes state', () => {
      game.dispatch({ type: 'updateGeneratorCount', payload: { generator: 'flashlight', count: 10 } })
      game.dispatch({ type: 'updateItemCount', payload: { item: 'photon', count: 500 } })
      game.dispatch({ type: 'setLeadScientist', payload: { scientist: 'einstein' } })

      const saved = game.save()

      // Create new game and load
      const newGame = createGame(matter)
      newGame.load(saved)

      expect(newGame.getState().generators.flashlight.count).toBe(10)
      expect(newGame.getState().items.photon.count).toBe(500)
      expect(newGame.getState().leadScientist).toBe('einstein')
    })
  })
})
