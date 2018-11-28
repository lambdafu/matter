import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import merge from 'deepmerge'

import { loadLocalState } from '../store/localstorage';

import matter from '../data/matter';

export const sagaMiddleware = createSagaMiddleware();

const initSavedState = {
    version: 0,
    activeScientist: "curie",
    topic: "sm",
    items: { sm: "photon", pt: "Cu" },
    generators: {},
    upgrades: {},
};

export function updateState(savedState) {
  //  const obj = yourArray.reduce((o, key) => ({ ...o, [key]: whatever}), {})

  const saved = merge(initSavedState, savedState || {});

  return { matter, saved  };
}

// const handlers = {};
//export const registerHandler = (key, handler) => handlers[key] = handler;

function reduceState(state, action) {
  //if (handlers.hasOwnProperty(action.type))
//  return { ...state, ...handlers[action.type](state, action.payload) };

  if (action.type === 'SET_STATE')
    return action.payload.value;
  else if (action.type === 'SET_SCIENTIST')
    return { ...state, saved: { ...state.saved, activeScientist: action.payload.value } }
  else if (action.type === 'SET_TOPIC')
    return { ...state, saved: { ...state.saved, topic: action.payload.value } }
  else if (action.type === 'SET_TOPIC_ITEM')
    return { ...state, saved: { ...state.saved, items: { ...state.saved.items,
      [action.payload.topic]: action.payload.item } } }
  return state;
}

const currentState = loadLocalState();

let store = createStore(reduceState, updateState(currentState),
                        applyMiddleware(sagaMiddleware));

export default store;
