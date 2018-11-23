import React, { Component } from 'react';
import { Segment, Transition } from 'semantic-ui-react';

import Scientist from './Scientist';
import LeadScientist from './LeadScientist';

export function showMessage(text){
 this.setState({text, visible: true});
}
export function hideMessage(){
 this.setState({visible: false});
}


class Notebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
        text: "Initial State",
        visible: false
    }
    showMessage = showMessage.bind(this);
    hideMessage = hideMessage.bind(this);
  }

  render() {
      return (
        <div style={ {width: 290} }>
          <LeadScientist />
          <Segment basic vertical>
          <Transition duration={{ hide: 500, show: 100 }} visible={this.state.visible}>
            <div>{this.state.text}</div>
          </Transition>
          </Segment>
        </div>
      );
      }
    }

export default Notebook;
