# Matter

An idle game about particle physics. Build generators to produce photons, electrons, and work your way through the Standard Model.

## Features

- **Linear Programming engine** - Production rates calculated via LP solver with breakpoint detection
- **Narrative system** - Story events trigger based on game state conditions
- **Upgrade system** - Permanent and temporary upgrades that modify generator efficiency
- **Standard Model & Periodic Table** - Two topic grids to explore

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build to dist/
npm run test:run  # Run tests once
npm test          # Run tests in watch mode
```

## Architecture

```
src/
  engine/         # Headless game engine (no React dependencies)
    data/         # Static game data (items, generators, upgrades, narrative)
    types.ts      # Type definitions
    index.ts      # Game creation and tick simulation
    solver.ts     # LP solver for production rates
    narrative.ts  # Event condition evaluation and effects
    reducers/     # State reducers for game actions
  ui/             # React UI layer
    components/   # React components
    hooks.ts      # React hooks for game state
  test/           # Vitest tests
```

## Tech Stack

- Vite + TypeScript + React 18
- Semantic UI React
- javascript-lp-solver
- Vitest

## References

- [Playing to Wait: A Taxonomy of Idle Games](https://pixl.nmsu.edu/files/2018/02/2018-chi-idle.pdf)
