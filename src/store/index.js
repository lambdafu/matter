import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import merge from 'deepmerge'
import functionReflector from 'js-function-reflector';

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

const handlers = {};

export function registerHandler(name, cb)
{
  const info = functionReflector(cb);
  const args = info.params.map((param) => param.name).slice(1);
  // eslint-disable-next-line no-new-func
  let new_cb = new Function("cb",
  "return (state, payload) => { const { " + args.join(", " ) + " } = payload; return cb(state, " + args.join(", ") + "); }");
  handlers[name] = new_cb(cb);
  // Return reflected standard action.
  // eslint-disable-next-line no-new-func
  return new Function(...args, "return { type: '" + name + "', payload: {" +
             args.join(", ") + "}};");
}

function reduceState(state, action) {
  if (handlers.hasOwnProperty(action.type))
    return { ...state, saved: handlers[action.type](state.saved, action.payload) };
  else if (action.type === 'SET_STATE')
    return action.payload.value;
  else if (action.type === 'SET_TOPIC')
    return { ...state, saved: { ...state.saved, topic: action.payload.value } }
  else if (action.type === 'SET_TOPIC_ITEM')
    return { ...state, saved: { ...state.saved, items: { ...state.saved.items,
      [action.payload.topic]: action.payload.item } } }
  return state;
}

const currentState = loadLocalState();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(reduceState, updateState(currentState),
                        composeEnhancers(applyMiddleware(sagaMiddleware)));

export default store;
