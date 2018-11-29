import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment } from 'semantic-ui-react';

import LeadScientist from './LeadScientist';
import Scientist from './Scientist';
import Notification from './Notification';

function mapStateToProps(state) {
  return {
    activeScientist: state.saved.activeScientist
  };
}

class Notebook extends Component {
  render() {
    return (
      <div style={ {width: 'auto', maxWidth: '290px', marginLeft: 'auto', marginRight: 'auto'} } >
        <LeadScientist />
        <Scientist tag={this.props.activeScientist} />
        <Segment basic vertical>
          <Notification />
        </Segment>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Notebook);
