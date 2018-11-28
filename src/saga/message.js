import { call, cancel, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'

import { showMessage, hideMessage } from '../components/Notification.js'

// Singleton.
let global_notifier;

function* pushMessage_impl(text) {
  showMessage(text);
  yield call(delay, 1500)
  hideMessage();
}

export function* pushMessage(text) {
  if (global_notifier !== undefined) {
    yield cancel(global_notifier);
    global_notifier = undefined;
  }
  global_notifier = yield fork(pushMessage_impl, text);
}
