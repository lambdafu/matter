import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment } from 'semantic-ui-react';

import LeadScientist from './LeadScientist.js';
import Scientist from './Scientist.js';
import Notification from './Notification.js';

import { saveState } from '../saga/state.js';

function mapStateToProps(state) {
  return {
    leadScientist: state.saved.leadScientist
  };
}

const style = {
  width: 'auto',
  maxWidth: '290px',
  marginLeft: 'auto',
  marginRight: 'auto',
};

class Notebook extends Component {
  render() {
    return (
      <div style={style} >
        <LeadScientist />
        <Scientist tag={this.props.leadScientist} />
        <Segment basic vertical>
          <Notification actionType={saveState.type}
            message="I am saving my progress and call it a day..." />
        </Segment>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Notebook);
