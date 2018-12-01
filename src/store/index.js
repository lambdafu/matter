import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import merge from 'deepmerge';

import matter from '../data/matter.js';
import { stateManager } from '../saga/state.js';
import { loadLocalState } from './localstorage.js';
import { rootReducer } from './reducer.js';

export const sagaMiddleware = createSagaMiddleware();

const initialState = {
  matter,
  saved: {
    version: 0,
    leadScientist: 'curie',
    topic: 'sm',
    items: { sm: 'photon', pt: 'Cu' },
    generators: {},
    upgrades: {},
  },
};

export function updateState(savedState) {
  return merge(initialState, { saved: savedState || {} });
}

// TODO Do this with an action after createStore
const currentState = updateState(loadLocalState());

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, currentState,
  composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(stateManager);
