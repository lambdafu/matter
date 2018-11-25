import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import merge from 'deepmerge'

import { loadLocalState } from '../store/localstorage';

export const sagaMiddleware = createSagaMiddleware();

const initState = {
    version: 0,
    ui: {
      scientist: "curie",
      topic: "sm",
      items: { sm: "photon", pt: "Cu" }
    }
};
export function updateState(state) {
  return merge(initState, state);
}

function reduceState(state, action) {
  if (action.type === 'SET_STATE')
    return action.payload.value;
  else if (action.type === 'SET_SCIENTIST')
    return { ...state, ui: { ...state.ui, scientist: action.payload.value } }
  else if (action.type === 'SET_TOPIC')
    return { ...state, ui: { ...state.ui, topic: action.payload.value } }
  else if (action.type === 'SET_TOPIC_ITEM')
    return { ...state, ui: { ...state.ui, items: { ...state.ui.items,
      [action.payload.topic]: action.payload.item } } }
  return state;
}

const currentState = loadLocalState();

let store = createStore(reduceState, updateState(currentState),
                        applyMiddleware(sagaMiddleware));

export default store;
