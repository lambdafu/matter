import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'semantic-ui-react';

import { registerHandler } from '../store/index.js';

 /* Set the current lead scientist. */
export const setLeadScientist = registerHandler("setLeadScientist",
  (state, leadScientist) => ({...state, leadScientist }));

const mapStateToProps = (state) => ({
  leadScientist: state.saved.leadScientist,
  scientists: Object.entries(state.matter.scientists)
    .map(([tag, scientist]) => ({
      text: scientist.name,
      value: tag,
    })),
});

const mapDispatchToProps = ({
  setLeadScientist,
});

class LeadScientist extends Component {
  render() {
    return (
      <div>
        <Dropdown fluid selection placeholder='Select Lead Scientist'
          options={this.props.scientists}
          onChange={(e, {value}) => this.props.setLeadScientist(value)}
          value={this.props.leadScientist} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeadScientist);
