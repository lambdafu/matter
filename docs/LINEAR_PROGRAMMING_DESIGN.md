# Linear Programming Approach to Idle Game Mechanics

## Overview

Matter uses Linear Programming (LP) to model and optimize the core mechanics of an idle/incremental game. This document describes the theoretical foundation and implementation of this approach, which provides elegant solutions to complex game state management problems.

## The Core Insight

Traditional idle games use simple tick-based simulation:
```
for each generator:
    if has_inputs:
        consume(inputs)
        produce(outputs)
```

This approach has problems:
1. **Order dependence**: Results vary based on which generator runs first
2. **Inefficient resource allocation**: Generators may starve each other
3. **No prediction**: Can't tell the player when resources will run out
4. **Discrete time**: Must simulate every tick, can't skip ahead

**The LP approach treats the game as a continuous optimization problem**, where generators are decision variables and the solver finds optimal resource allocation automatically.

## Mathematical Model

### Entities

1. **Items** (resources): Things that can be counted and consumed
   - Examples: photons, electrons, energy, gold
   - State: `count` (current amount in inventory)

2. **Generators** (machines/factories): Transform items over time
   - Properties: `inputs` (items consumed per second), `outputs` (items produced per second)
   - State: `count` (number of instances), `utilization` (0-1, how busy it is)

3. **Upgrades** (modifiers): One-time purchases that modify generators
   - Effects: efficiency multipliers, additional outputs, reduced inputs
   - Optional expiration (temporary upgrades)

### The LP Formulation

**Decision Variables:**
- `u_g` = utilization of generator g (0 ≤ u_g ≤ 1)

**Objective:**
- Maximize total utilization: `max Σ u_g`
- (Can be weighted to prioritize certain generators)

**Constraints:**

1. **Utilization bounds**: Each generator runs between 0-100%
   ```
   0 ≤ u_g ≤ 1  for all generators g
   ```

2. **Inventory constraints**: Can't consume more than available
   ```
   Σ (consumption_rate_g,i × count_g × u_g) ≤ inventory_i  for all items i
   ```

   Where `consumption_rate_g,i = input_rate - output_rate` (net consumption)

### Example

Consider:
- 1000 photons in inventory
- 10 flashlights (produce 1 photon/s each)
- 1 solar panel (consumes 100 photons/s, produces 1 electron/s)

The LP solver determines:
- Flashlights run at 100% utilization (u = 1.0)
- Solar panel runs at 100% utilization (u = 1.0)
- Net photon delta: +10 - 100 = -90/s
- Prediction: photons run out in ~11 seconds

If we only had 50 photons:
- Solar panel would run at 50% utilization
- Net delta: +10 - 50 = -40/s
- System reaches equilibrium differently

## Upgrade Effects

Upgrades modify the effective rates of generators:

```typescript
interface UpgradeEffect {
  generator: string
  type: 'efficiency' | 'addOutput' | 'addInput' | 'reduceInput'
  target?: string  // item key for add/reduce effects
  value: number    // multiplier or amount
}
```

**Efficiency**: Multiplies all input and output rates
```
effective_rate = base_rate × efficiency_multiplier
```

**Add/Reduce**: Modifies specific resource flows
```
effective_outputs[item] = base_outputs[item] + added_output
effective_inputs[item] = max(0, base_inputs[item] - reduced_input)
```

## Temporary Upgrades: The Pseudo-Resource Model

### The Problem

Temporary upgrades that expire after N seconds seem to require wall-clock timers outside the LP model. But this breaks the elegance of unified prediction.

### The Solution: Model Expiration as Resource Consumption

**Key Insight**: An expiring upgrade is equivalent to a "hidden generator" that consumes a pseudo-resource representing the upgrade's remaining duration.

When a temporary upgrade is purchased:

1. **Create a pseudo-resource**: `{upgradeKey}_durability`
   - Initial amount = expiration time in seconds (e.g., 300 for 5 minutes)
   - This is an internal resource, not shown to the player

2. **Create a hidden generator**: `{upgradeKey}_decay`
   - Consumes 1 unit of `{upgradeKey}_durability` per second
   - Produces nothing
   - Always runs at 100% utilization when upgrade is active

3. **The LP solver naturally handles this**:
   - Durability decreases linearly
   - Solver can predict exactly when it hits zero
   - At zero, the upgrade becomes inactive
   - All generators affected by the upgrade recalculate their effective rates

### Breakpoint Detection

The solver can identify "breakpoints" - moments when the system state changes qualitatively:

1. **Resource depletion**: An item count reaches zero
2. **Upgrade expiration**: A durability pseudo-resource reaches zero
3. **Generator starvation**: A generator's utilization drops due to input shortage

At each breakpoint, the game should:
1. Advance simulation to that exact moment
2. Update state (deactivate upgrade, mark resource depleted, etc.)
3. Re-run the solver for the new configuration
4. Continue simulation with updated predictions

### Advantages of This Model

1. **Unified prediction**: The solver tells you exactly when everything happens
2. **Correct interactions**: If an expiring upgrade affects resource flow, its expiration is factored into all predictions
3. **Efficient simulation**: Can skip ahead to breakpoints instead of simulating every tick
4. **Visual feedback**: Show "upgrade expires in 4:32" based on solver prediction
5. **No separate timer system**: Everything flows through the LP model

## Implementation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Game Engine                          │
├─────────────────────────────────────────────────────────────┤
│  State                                                      │
│  ├── items: { photon: { count: 1000 }, ... }               │
│  ├── generators: { flashlight: { count: 10 }, ... }        │
│  ├── upgrades: { lipobat: { acquired: true }, ... }        │
│  └── pseudoResources: { lipobat_durability: 300, ... }     │
├─────────────────────────────────────────────────────────────┤
│  Solver                                                     │
│  ├── Build LP model from state + matter definitions        │
│  ├── Apply upgrade effects to get effective rates          │
│  ├── Include pseudo-resources and decay generators         │
│  ├── Solve for optimal utilization                         │
│  ├── Calculate deltas (production - consumption)           │
│  └── Find next breakpoint (first resource to hit zero)     │
├─────────────────────────────────────────────────────────────┤
│  Simulation Loop                                            │
│  ├── Run solver to get prediction                          │
│  ├── Advance time by min(tick_interval, time_to_breakpoint)│
│  ├── Update item counts based on deltas                    │
│  ├── If breakpoint reached:                                │
│  │   ├── Handle event (upgrade expiration, etc.)           │
│  │   └── Re-run solver                                     │
│  └── Notify UI of state changes                            │
└─────────────────────────────────────────────────────────────┘
```

## Future Extensions

### Weighted Optimization

Instead of maximizing total utilization, weight generators by value:
```
max Σ (value_g × u_g)
```

This lets the solver prioritize producing valuable resources.

### Multi-Phase Prediction

The solver could compute multiple breakpoints ahead of time:
1. "In 30s, photons run out, solar panel stops"
2. "In 45s, upgrade expires, flashlight output halves"
3. "In 2min, electrons run out, everything stops"

This enables rich prediction UI showing the future timeline.

### Constraint Relaxation for "What-If" Analysis

Ask the solver: "What if I had 1000 more photons?"
- Add slack variables to constraints
- Dual values tell you the "shadow price" of each resource
- Guides player decisions about what to acquire next

### Integer Programming for Discrete Purchases

Extend to IP for questions like:
- "How many more flashlights can I afford?"
- "What's the optimal generator mix for my budget?"

## References

- Linear Programming fundamentals: Dantzig, G. B. (1963). Linear Programming and Extensions.
- javascript-lp-solver: The LP library used in this implementation
- Idle game design patterns: [Various incremental game communities]

## Conclusion

By framing idle game mechanics as a linear programming problem, we achieve:
1. **Optimal resource allocation** without manual priority systems
2. **Accurate prediction** of future game states
3. **Elegant handling of temporary effects** through pseudo-resources
4. **A unified mathematical framework** that can be extended and analyzed

This approach may have applications beyond games, anywhere that continuous resource transformation systems need optimization and prediction.
