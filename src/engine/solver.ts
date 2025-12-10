/**
 * Linear Programming Solver for Matter
 *
 * This module implements an LP-based approach to idle game mechanics.
 * See docs/LINEAR_PROGRAMMING_DESIGN.md for the full design document.
 *
 * Key concepts:
 * - Generators are decision variables with utilization 0-1
 * - Resources constrain how much generators can run
 * - Upgrades modify effective rates through efficiency/addOutput/etc.
 * - Temporary upgrades use "durability" as a pseudo-resource
 * - The solver predicts breakpoints (when resources deplete or upgrades expire)
 */

import type {
  MatterData,
  SavedState,
  Prediction,
  ItemPrediction,
  GeneratorPrediction,
  Generator,
  Breakpoint,
} from './types'
import solver from 'javascript-lp-solver'

/**
 * LP Model structure for the solver
 */
interface LPModel {
  optimize: string
  opType: 'max' | 'min'
  constraints: Record<string, { max?: number; min?: number }>
  variables: Record<string, Record<string, number>>
}

/**
 * Effective generator rates after applying upgrade effects
 */
interface EffectiveRates {
  inputs: Record<string, number>
  outputs: Record<string, number>
}

/**
 * Check if an upgrade is currently active (acquired and not expired).
 */
function isUpgradeActive(upgradeKey: string, state: SavedState): boolean {
  const upgradeState = state.upgrades[upgradeKey]
  if (!upgradeState?.acquired) return false
  // If durability is defined and <= 0, the upgrade has expired
  if (upgradeState.durability !== undefined && upgradeState.durability <= 0) return false
  return true
}

/**
 * Calculate effective input/output rates for a generator after applying upgrades.
 *
 * Upgrades modify generators in several ways:
 * - efficiency: Multiplies all input/output rates
 * - addOutput: Adds a secondary output resource
 * - addInput: Adds a secondary input requirement
 * - reduceInput: Reduces an existing input requirement
 */
function getEffectiveRates(
  generatorKey: string,
  generatorDef: Generator,
  matter: MatterData,
  state: SavedState
): EffectiveRates {
  // Start with base rates
  let efficiency = 1.0
  const inputs = { ...generatorDef.inputs }
  const outputs = { ...generatorDef.outputs }

  // Apply upgrade effects from active upgrades only
  for (const upgradeKey of Object.keys(state.upgrades)) {
    if (!isUpgradeActive(upgradeKey, state)) continue

    const upgrade = matter.upgrades[upgradeKey]
    if (!upgrade) continue

    for (const effect of upgrade.effects) {
      if (effect.generator !== generatorKey) continue

      switch (effect.type) {
        case 'efficiency':
          efficiency *= effect.value
          break
        case 'addOutput':
          if (effect.target) {
            outputs[effect.target] = (outputs[effect.target] ?? 0) + effect.value
          }
          break
        case 'addInput':
          if (effect.target) {
            inputs[effect.target] = (inputs[effect.target] ?? 0) + effect.value
          }
          break
        case 'reduceInput':
          if (effect.target) {
            inputs[effect.target] = Math.max(0, (inputs[effect.target] ?? 0) - effect.value)
          }
          break
      }
    }
  }

  // Apply efficiency multiplier to all rates
  const effectiveInputs: Record<string, number> = {}
  const effectiveOutputs: Record<string, number> = {}

  for (const [itemKey, rate] of Object.entries(inputs)) {
    effectiveInputs[itemKey] = rate * efficiency
  }
  for (const [itemKey, rate] of Object.entries(outputs)) {
    effectiveOutputs[itemKey] = rate * efficiency
  }

  return { inputs: effectiveInputs, outputs: effectiveOutputs }
}

/**
 * Calculate the next breakpoint based on current deltas.
 *
 * A breakpoint occurs when:
 * 1. A resource being consumed reaches zero
 * 2. An upgrade's durability reaches zero (modeled as pseudo-resource consumption)
 *
 * The breakpoint with the smallest time is returned.
 */
function calculateNextBreakpoint(
  itemDeltas: Record<string, number>,
  itemCounts: Record<string, number>,
  state: SavedState,
  _matter: MatterData
): Breakpoint | null {
  let nextBreakpoint: Breakpoint | null = null

  // Check for resource depletion breakpoints
  for (const [itemKey, delta] of Object.entries(itemDeltas)) {
    // Only care about resources being consumed (negative delta)
    if (delta >= 0) continue

    const currentCount = itemCounts[itemKey] ?? 0
    if (currentCount <= 0) continue // Already depleted

    // Time until this resource hits zero: count / |delta|
    const timeUntil = currentCount / Math.abs(delta)

    if (nextBreakpoint === null || timeUntil < nextBreakpoint.timeUntil) {
      nextBreakpoint = {
        timeUntil,
        type: 'resourceDepleted',
        key: itemKey,
      }
    }
  }

  // Check for upgrade expiration breakpoints
  // Upgrades with durability are modeled as pseudo-resources consumed at 1/second
  for (const [upgradeKey, upgradeState] of Object.entries(state.upgrades)) {
    if (!upgradeState.acquired) continue
    if (upgradeState.durability === undefined) continue // Permanent upgrade
    if (upgradeState.durability <= 0) continue // Already expired

    // Durability decreases at 1 per second (the "decay generator" consumes it)
    const timeUntil = upgradeState.durability

    if (nextBreakpoint === null || timeUntil < nextBreakpoint.timeUntil) {
      nextBreakpoint = {
        timeUntil,
        type: 'upgradeExpired',
        key: upgradeKey,
      }
    }
  }

  return nextBreakpoint
}

/**
 * Solve the linear programming optimization problem for generator utilization.
 *
 * The LP solver optimizes factory utilization (0 to 1 per factory) subject to:
 * 1. Each generator's utilization <= 1 (can't run at more than 100%)
 * 2. Item consumption <= current inventory (can't consume more than we have)
 *
 * The objective is to maximize the weighted sum of utilizations (currently all weight 1).
 *
 * This function also calculates the next breakpoint - the moment when system state
 * will change (resource depleted or upgrade expired). This allows the simulation
 * to skip ahead efficiently and handle state transitions correctly.
 */
export function solvePrediction(matter: MatterData, state: SavedState): Prediction {
  const { items, generators } = state

  // Build constraint entries for items (inventory limits)
  const itemConstraints: Record<string, { max: number }> = {}
  for (const [itemKey, itemState] of Object.entries(items)) {
    itemConstraints[itemKey] = { max: itemState.count }
  }

  // Build constraint entries for generators (utilization max 1)
  const generatorConstraints: Record<string, { max: number }> = {}
  for (const generatorKey of Object.keys(generators)) {
    generatorConstraints[generatorKey] = { max: 1 }
  }

  // Build variables (one per generator)
  // Cache effective rates for use in result calculation
  const effectiveRatesCache: Record<string, EffectiveRates> = {}
  const variables: Record<string, Record<string, number>> = {}
  for (const [generatorKey, generatorState] of Object.entries(generators)) {
    const generatorDef = matter.generators[generatorKey]
    if (!generatorDef || generatorState.count === 0) continue

    // Get effective rates with upgrades applied
    const effectiveRates = getEffectiveRates(generatorKey, generatorDef, matter, state)
    effectiveRatesCache[generatorKey] = effectiveRates

    const variable: Record<string, number> = {
      // Objective: maximize utilization with priority 1
      priority: 1,
    }

    // Utilization constraint: this generator contributes 1 to its own constraint
    for (const otherKey of Object.keys(generators)) {
      variable[otherKey] = generatorKey === otherKey ? 1 : 0
    }

    // Item constraints: net consumption (inputs - outputs) scaled by generator count
    for (const itemKey of Object.keys(items)) {
      const inputRate = effectiveRates.inputs[itemKey] ?? 0
      const outputRate = effectiveRates.outputs[itemKey] ?? 0
      // Positive = consumption, negative = production
      const netConsumption = generatorState.count * (inputRate - outputRate)
      variable[itemKey] = netConsumption
    }

    variables[generatorKey] = variable
  }

  const model: LPModel = {
    optimize: 'priority',
    opType: 'max',
    constraints: {
      ...itemConstraints,
      ...generatorConstraints,
    },
    variables,
  }

  // Solve the LP problem
  const solution = solver.Solve(model) as Record<string, number>

  // Calculate item deltas (production - consumption)
  const itemResults: Record<string, ItemPrediction> = {}
  const itemDeltas: Record<string, number> = {} // For breakpoint calculation
  const itemCounts: Record<string, number> = {} // For breakpoint calculation

  for (const itemKey of Object.keys(items)) {
    let delta = 0
    let maxdelta = 0

    for (const [generatorKey, generatorState] of Object.entries(generators)) {
      const generatorDef = matter.generators[generatorKey]
      if (!generatorDef || generatorState.count === 0) continue

      // Use cached effective rates (with upgrades applied)
      const effectiveRates = effectiveRatesCache[generatorKey]
      if (!effectiveRates) continue

      const inputRate = effectiveRates.inputs[itemKey] ?? 0
      const outputRate = effectiveRates.outputs[itemKey] ?? 0
      // max delta assumes full utilization
      const maxChange = generatorState.count * (outputRate - inputRate)
      // actual delta uses solved utilization
      const utilization = solution[generatorKey] ?? 0
      const actualChange = utilization * maxChange

      maxdelta += maxChange
      delta += actualChange
    }

    itemResults[itemKey] = { delta, maxdelta }
    itemDeltas[itemKey] = delta
    itemCounts[itemKey] = items[itemKey]?.count ?? 0
  }

  // Calculate generator utilizations
  const generatorResults: Record<string, GeneratorPrediction> = {}
  for (const [generatorKey, generatorState] of Object.entries(generators)) {
    const utilization = generatorState.count === 0 ? 0 : (solution[generatorKey] ?? 0)
    const utilizationMax = generatorState.count === 0 ? 0 : 1

    generatorResults[generatorKey] = { utilization, utilizationMax }
  }

  // Calculate the next breakpoint
  const nextBreakpoint = calculateNextBreakpoint(itemDeltas, itemCounts, state, matter)

  return {
    model: model as unknown,
    solution,
    result: {
      items: itemResults,
      generators: generatorResults,
    },
    nextBreakpoint,
  }
}
