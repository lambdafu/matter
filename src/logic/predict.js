import { registerHandler2 } from '../store/reducer.js';
import merge from 'deepmerge';

import solver from '@uandi/javascript-lp-solver';

export const updatePrediction = registerHandler2("updatePrediction",
  (state, saved) => (merge(saved, {
  prediction: logit(state),
  }))
);


//import logit from './logic/predict.js';
//logit()
// Here is how this works: Linear Programming optimizes a set of variables (x) under
// certain constraints.  In our case, we are aiming to maximize the utilization of
// the factories in the game.  The utilization will normally be between 0 and 1, where
// 1 means the factory is running at full capacity.
//
// Linear programming's goal is to maximize (opType) a weighted sum of the variables (c^T x).
// The weights here are priorities we assign to the factories. With these weights, we
// can favor some factory over another. Indirectly, we can favor certain items this way
// (if the prioritized factory produces that item). Currently, we don't have any good
// idea on how to convert priorities for items to priorities for factories, so item
// priority is currently ignored.
//
// Linear programming is subject to constraints.  First and foremost, all results
// must be non-negative. In addition to that, we can give a set of linear inequations.
// each linear inequation specifies that a weighted sum of the variables must be
// smaller than some value.
// We use two sets of inequalities: One set to control item production and consumption,
// and one set to control utiliziation of factories.
// The utilization is controlled in a simple manner: For each factory, we add one
// inequality: That the utilization of that factory must be at most 1. We achieve
// this by giving that factory a weight of 1 and every other factory a weight of 0.
// Finally, we say that this sum must be at most 1.
// The item production and consumption is also controlled easily. For each item,
// we weigh the utilization of each factory with the net consumption of that item.
// (consumption minus production). This net consumption must be less or equal than the
// current inventory of that item.
//
// After calculating the utilization of all factories by solving the LP problem
// (there should always be a solution in our case, because utilization all zero
// should satisfy all constraints), we need to calculate for each item the
// burndown rate and time until inventory is fully consumed. The item that is fully
// consumed first determines the time period for that this optimization calculation
// is valid. After that time, the inventory should be set to 0, and the calculation
// should be redone with the new inventory, until all burndown rates are negative,
// or enough of the future is calculated.

export default
function logit(state) {
    const matter = state.matter;
    const saved = state.saved;

  const model = {
    optimize: "priority",
    opType: "max",
    constraints: Object.assign({},
      // This constraint monitors input/output balance over inventory.
      // The result will only be valid until the first item is fully consumed.
      // This has to be checked afterwards by comparing the burn rate against
      // the current inventory and determining the first time an item with stock
      // is depleted to zero.
      ...Object.entries(saved.items).map(([tag, item]) => ({ [tag]: { max: item.count } })),
      // Little bit confusing: The variables are named the same as these constraints,
      // but note that they are distinct as far as the solver is concerned.
      ...Object.entries(saved.generators).map(([tag_constraint, generator]) => ({ [tag_constraint]: { max: 1 /* max_utilization */ } }))
    ),
    variables: Object.assign({},
      ...Object.entries(saved.generators).map(([tag, generator]) => ({
        [tag]: Object.assign({},
           // This factors the variable into the optimization target.
                             { priority: 1 /* priority */ },
           // This factors the variable into the utilization constraint.
           ...Object.entries(saved.generators).map(([tag_constraint, generator_constraint]) => ({
             [tag_constraint]: tag === tag_constraint ? 1 : 0
           })),
           // This factors the variable into the input/output constraints.
           ...Object.entries(saved.items).map(([tag_item, item]) => ({
             // We add all consumers, and subtract all generators.
             [tag_item]: generator.count * (matter.generators[tag].inputs[tag_item] || 0) - (generator.count * matter.generators[tag].outputs[tag_item] || 0)
            })),
    )})))
  };

    const solution = solver.Solve(model);
    const items = Object.assign({}, ...Object.entries(saved.items).map(([itemKey, item]) => {
        const generator_deltas = Object.entries(saved.generators).map(([generatorKey, generator]) => {
            const maxdelta = generator.count * (matter.generators[generatorKey].outputs[itemKey] || 0) - (generator.count * matter.generators[generatorKey].inputs[itemKey] || 0);
            const delta = solution[generatorKey] * maxdelta;
            return { delta, maxdelta };
        });
        return { [itemKey]: generator_deltas.reduce((a,b) => ({ delta: a.delta + b.delta, maxdelta: a.maxdelta + b.maxdelta }), { delta: 0, maxdelta: 0 }) };
    }));
    const generators = Object.assign({}, ...Object.entries(saved.generators).map(([generatorKey, generator]) => {
        return { [generatorKey]: { utilization: (generator.count === 0 ? 0 : solution[generatorKey]),
                                   utilizationMax: (generator.count === 0 ? 0 : 1) } };
    }));

    const result = { model, solution, result: { items, generators } };
    console.log(result);

    return result;
}
