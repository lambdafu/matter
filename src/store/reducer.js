import merge from 'deepmerge';

import matter from '../data/matter.js';

const initialState = {
  matter,
  saved: {
    version: 0,
    leadScientist: 'curie',
    gui: {
      topic: 'sm',
      items: { sm: 'photon', pt: 'Cu' },
    },
    // Filled in updateState.
    topics: {},
    generators: {},
    upgrades: {},
  },
};

export function updateState(savedState) {
  // Create the initial topics with items.
  const topics = {};
  for (const [topic_name, topic] of Object.entries(matter.topics)) {
    const items = {};
    topics[topic_name] = items;
    for (const [item_name, item] of Object.entries(topic.items)) {
      items[item_name] = { available: false, count: 0 };
    }
  }

  const generators = {};
  for (const [generator_name, generator] of Object.entries(matter.generators)) {
    generators[generator_name] = { available: false, count: 0 };
  }

  const upgrades = {};
  for (const [upgrade_name, upgrade] of Object.entries(matter.upgrades)) {
    upgrades[upgrade_name] = { available: false, acquired: false };
  }

  // Enrich the initial state by the generated initial state.
  const initial_state = merge(initialState, { saved: {
    topics,
    generators,
    upgrades,
  }});

  // Now merge the current save state into the initial state.
  const state = merge(initial_state, { saved: savedState || {} });
  return state;
}

/* Registered action reducers.  */
const handlers = {};

const noop = () => {};
export function registerHandler(name, reducer = noop) {
  if (handlers.hasOwnProperty(name))
    throw new Error(`Handler with name "${name}" was already registered.`);
  handlers[name] = (state, payload) => reducer(state, ...payload);

  const actionCreator = (...payload) => ({ type: name, payload });
  actionCreator.type = name;
  return actionCreator;
}

export function rootReducer(state=initialState, action) {
  if (handlers.hasOwnProperty(action.type))
    return {
      ...state,
      saved: {
        ...state.saved,
        ...handlers[action.type](state.saved, action.payload),
      },
    };

  console.log(`Action "${action.type}" does not exist!`, action);

  return state;
}
