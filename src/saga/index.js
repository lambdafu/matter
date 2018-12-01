import { cancel } from 'redux-saga/effects';

import { sagaMiddleware } from '../store/index.js';

export const run = sagaMiddleware.run;

export function terminate(task) {
  run(function*(task) { yield cancel(task) }, task);
}
