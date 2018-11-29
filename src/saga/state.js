import { call, put, select, take } from 'redux-saga/effects'
import { loadLocalState, saveLocalState } from '../store/localstorage'
import { registerHandler, updateState } from '../store';
import { run } from '.';

export const setState = registerHandler("setState",
  (state, value) => value.saved);

export const resetState = registerHandler("resetState",
  (state) => state);

export const loadState = registerHandler("loadState",
  (state) => state);

export const saveState = registerHandler("saveState",
  (state) => state);

export function* resetStateTask() {
  const new_state = updateState(undefined);
  yield put(setState(new_state));
}

export function* loadStateTask() {
  const state = yield call(loadLocalState);
  const new_state = updateState(state);
  yield put(setState(new_state));
}

export function* saveStateTask() {
  const getState = (state) => state;
  const state = yield select(getState);
  yield call(saveLocalState, state.saved);
}

function* stateManager() {
  while (true) {
    const action = yield take(["resetState", "loadState", "saveState"]);
      if (action.type === "resetState")
        yield call(resetStateTask);
      else if (action.type === "loadState")
        yield call(loadStateTask);
      else if (action.type === "saveState")
        yield call(saveStateTask);
    }
  }

run(stateManager);
