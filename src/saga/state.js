import { call, put, select } from 'redux-saga/effects'
import { loadLocalState, saveLocalState } from '../store/localstorage'
import { pushMessage } from './message'
import { updateState } from '../store';

import { SET_STATE } from '../store/actions'

export const getState = (state) => state;

export function* saveState() {
  const state = yield select(getState);
  yield call(saveLocalState, state.saved);
  yield call(pushMessage, "I saved my progress and called it a day...");
}

export function* loadState() {
  const state = yield call(loadLocalState);
  const new_state = updateState(state);
  yield put(SET_STATE(new_state));
}
