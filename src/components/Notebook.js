import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Segment } from 'semantic-ui-react';

import LeadScientist from './LeadScientist';
import Scientist from './Scientist';
import Notification from './Notification';

function mapStateToProps(state) {
  return {
    leadScientist: state.saved.leadScientist
  };
}

class Notebook extends Component {
  render() {
    return (
      <div style={ {width: 'auto', maxWidth: '290px', marginLeft: 'auto', marginRight: 'auto'} } >
        <LeadScientist />
        <Scientist tag={this.props.leadScientist} />
        <Segment basic vertical>
          <Notification test={2} />
        </Segment>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Notebook);
