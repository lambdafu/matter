import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'semantic-ui-react';

import scientists from '../data/scientists';
import ui from '../data/ui';

import { registerHandler } from '../store/index.js';

const scientistOptions = ui.scientists.map(name => ({
   text: scientists[name].name,
   value: name
 }));
 //     image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },

 /* Set the current lead scientist. */
export const SET_SCIENTIST = registerHandler("SET_SCIENTIST",
  (state, activeScientist) => { return {...state, activeScientist }});

const mapStateToProps = (state) => {
   return {
       lead: state.saved.activeScientist
   };
 }

const mapDispatchToProps = (dispatch) => {
    return {
    setLead: (id) => {
      dispatch(SET_SCIENTIST(id))
    }
  }
}

class LeadScientist extends Component {
  render() {
         return (
           <div>
           <Dropdown fluid placeholder='Select Lead Scientist' selection options={scientistOptions}
         onChange={(e, {value}) => this.props.setLead(value)}
         value={this.props.lead} />
       </div>);
       }
    }

export default connect(mapStateToProps, mapDispatchToProps)(LeadScientist);
