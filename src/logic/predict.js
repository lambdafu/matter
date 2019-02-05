import solver from '@uandi/javascript-lp-solver';

export default
function logit() {
  const factories = {
    'factory1': {
      // Priority values this factory compared to others.
      // Negative numbers discourage this factory.
      // Usually 1, but may be adjusted to change the optimization goal.
      // Special affects might change this, too.  For example, a strike
      // in a factory could penalize its use.
      // Alternatively, we might prioritize factories with a positive item
      // balance for particular items.
      priority: 1,
      // Max utilization, usually 1, but special events might cap this.
      // Set to 0 to disable a factory entirely.
      max_utilization: 1,
      // All inputs.
      input: {},
      output: { item1: 3 },
    },
    'factory2': {
      priority: 1,
      max_utilization: 1,
      input: { item1: 4 },
      output: { item1: 5 },
    },
    'factory3': {
      priority: 1,
      max_utilization: 1,
      input: { item1: 5 },
      output: { item1: 10 },
    },
    'factory4': {
      priority: 1,
      max_utilization: 1,
      input: { item1: 10 },
      output: { item1: 1 },
    },
  };

  const item = {
    'item1': {
      // Priority values this item compared to others.
      // Negative numbers discourage this item.  Needs to be combined
      // with the balance of factories consuming/producing this items
      // and turned into a priority for the factory(!).
      priority: 1,
      // Current inventory.
      amount: 100,
    }
  };

  const model2 = {
    optimize: "priority",
    opType: "max",
    constraints: Object.assign({},
      // This constraint monitors input/output balance over inventory.
      // The result will only be valid until the first item is fully consumed.
      // This has to be checked afterwards by comparing the burn rate against
      // the current inventory and determining the first time an item with stock
      // is depleted to zero.
      ...Object.entries(item).map(([tag, item]) => ({ [tag]: { max: item.amount } })),
      // Little bit confusing: The variables are named the same as these constraints,
      // but note that they are distinct as far as the solver is concerned.
      ...Object.entries(factories).map(([tag_constraint, factories]) => ({ [tag_constraint]: { max: factories.max_utilization } }))
    ),
    variables: Object.assign({},
      ...Object.entries(factories).map(([tag, factory]) => ({
        [tag]: Object.assign({},
           // This factors the variable into the optimization target.
           { priority: factory.priority },
           // This factors the variable into the utilization constraint.
           ...Object.entries(factories).map(([tag_constraint, factory_constraint]) => ({
             [tag_constraint]: tag === tag_constraint ? 1 : 0
           })),
           // This factors the variable into the input/output constraints.
           ...Object.entries(item).map(([tag_item, item]) => ({
             // We add all inputs, and subtract all outputs.
             [tag_item]: (factory.input[tag_item] || 0) - (factory.output[tag_item] || 0)
            })),
    )})))
  };

//   const model = {
//     optimize: "priority",
//     opType: "max",
//     constraints: {
//         // item1 demand: input minus output
//         item1: { max: 0 },
//         item2: { max: 0 }, // Bestand.
//         utilization1: { max: 1 },
//         utilization2: { max: 1 },
//         utilization3: { max: 1 },
//         utilization4: { max: 1 },
//     },
//     variables: {
//         p1: {
//             priority: 1,
//             item1: 3+1-5,
//             item2: -0.5,
//             utilization1: 1,
//             utilization2: 0,
//             utilization3: 0,
//             utilization4: 0,
//         },
//         p2: {
//             priority: 1,
//             item1: 5-10,
//             item2: 1,
//             utilization1: 0,
//             utilization2: 1,
//             utilization3: 0,
//             utilization4: 0,
//         },
//         p3: {
//             priority: 1,
//             item1: 10-1,
//             item2: 1,
//             utilization1: 0,
//             utilization2: 0,
//             utilization3: 1,
//             utilization4: 0,
//         },
//         p4: {
//             priority: 1,
//             item1: -3,
//             utilization1: 0,
//             utilization2: 0,
//             utilization3: 0,
//             utilization4: 1,
//         },
//     },
// };
 let result = solver.Solve(model2);
 console.log(result);
}
