import { call, put, select, take } from 'redux-saga/effects';

import { updateState } from '../store/reducer.js';
import { loadLocalState, saveLocalState } from '../store/localstorage.js';
import { registerHandler } from '../store/reducer.js';

export const setState = registerHandler('setState',
  (state, saved) => saved);

export const resetState = registerHandler('resetState');

export const loadState = registerHandler('loadState');

export const saveState = registerHandler('saveState');

export function* resetStateTask() {
  const new_state = updateState(undefined);
  yield put(setState(new_state.saved));
}

export function* loadStateTask() {
  const state = yield call(loadLocalState);
  const new_state = updateState(state);
  yield put(setState(new_state.saved));
}

export function* saveStateTask() {
  const getState = (state) => state;
  const state = yield select(getState);
  yield call(saveLocalState, state.saved);
}

export function* stateManager() {
  // Load initial state.
  yield call(loadStateTask);

  while (true) {
    const action = yield take([
      resetState.type,
      loadState.type,
      saveState.type,
    ]);

    if (action.type === resetState.type)
      yield call(resetStateTask);
    else if (action.type === loadState.type)
      yield call(loadStateTask);
    else if (action.type === saveState.type)
      yield call(saveStateTask);
  }
}
