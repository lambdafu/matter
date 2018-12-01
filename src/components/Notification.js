import React, { Component } from 'react';
import { delay } from 'redux-saga';
import { cancel, fork, take } from 'redux-saga/effects';

import { Transition } from 'semantic-ui-react';

import { run, terminate } from '../saga/index.js';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = { text: null, visible: false };
    this.monitor = undefined;

    this.monitorTask = this.monitorTask.bind(this);
    this.pushMessage = this.pushMessage.bind(this);
  }

  componentDidMount() {
    this.monitor = run(this.monitorTask);
  }

  componentWillUnmount() {
    terminate(this.monitor);
  }

  *monitorTask() {
    let notifier;
    while (true) {
      yield take(this.props.actionType);
      if (notifier)
        yield cancel(notifier);
      notifier = yield fork(this.pushMessage, this.props.message)
    }
  }

  *pushMessage(text) {
    this.showMessage(text);
    yield delay(1500);
    this.hideMessage();
  }

  showMessage(text) {
    this.setState({ text, visible: true });
  }

  hideMessage() {
    this.setState({ visible: false });
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
