import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { loadLocalState, saveLocalState } from '../store/localstorage'
import { pushMessage } from './message'

import { SET_STATE } from '../store/actions'

export const getState = (state) => state;

export function* saveState() {
  const state = yield select(getState);
  yield call(saveLocalState, state);
  yield call(pushMessage, "I saved my progress and called it a day...");
}

export function* loadState() {
  const state = yield call(loadLocalState);
  yield put(SET_STATE(state));
}
