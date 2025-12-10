declare module 'javascript-lp-solver' {
  interface Model {
    optimize: string
    opType: 'max' | 'min'
    constraints: Record<string, { max?: number; min?: number }>
    variables: Record<string, Record<string, number>>
    ints?: Record<string, number>
  }

  interface Solution extends Record<string, number> {
    feasible: boolean
    result: number
    bounded: boolean
  }

  function Solve(model: Model): Solution

  const solver: {
    Solve: typeof Solve
  }

  export default solver
  export { Solve }
}
