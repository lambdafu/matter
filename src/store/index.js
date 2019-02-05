import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { stateManager } from '../saga/state.js';
import { rootReducer } from './reducer.js';

export const sagaMiddleware = createSagaMiddleware();



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(stateManager);
