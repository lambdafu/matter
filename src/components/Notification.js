import React, { Component } from 'react';
import { delay } from 'redux-saga'
import { cancel, fork, take } from 'redux-saga/effects'

import { Transition } from 'semantic-ui-react';

import { run, terminate } from '../saga';

function* pushMessage(component, text) {
  component.showMessage(text);
  yield delay(1500);
  component.hideMessage();
}

function* monitorTask(component) {
  let notifier = undefined;
  while (true) {
    yield take("saveState");
    if (notifier !== undefined)
      yield cancel(notifier);
    notifier = yield fork(pushMessage, component,
      "I am saving my progress and call it a day...");
  }
}

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = { text: null, visible: false };
  }

  componentDidMount() {
    this.monitor = run(monitorTask, this);
  }

  componentWillUnmount() {
    terminate(this.monitor);
  }

  showMessage(text) {
    this.setState({ text, visible: true });
  }

  hideMessage(text) {
    this.setState({ ...this.state, visible: false });
  }

  render() {
    return (
      <Transition duration={{ hide: 500, show: 100 }}
        visible={this.state.visible}>
        <div>{this.state.text}</div>
      </Transition>
    );
  }
}

export default Notification;
