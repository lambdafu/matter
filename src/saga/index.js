import { cancel } from 'redux-saga/effects';
import { sagaMiddleware } from '../store/index';

export function run(saga, ...args) {
  return sagaMiddleware.run(saga, ...args);
}

export function terminate(task) {
  run(function*(task) { yield cancel(task) }, task);
}
