import React, { Component } from 'react';

import { Transition } from 'semantic-ui-react';

export function showMessage(text){
 this.setState({text, visible: true});
}

export function hideMessage(){
 this.setState({visible: false});
}

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
        text: "Initial State",
        visible: false
    };
    showMessage = showMessage.bind(this);
    hideMessage = hideMessage.bind(this);
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
