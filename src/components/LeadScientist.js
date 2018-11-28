import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'semantic-ui-react';

import { SET_SCIENTIST } from '../store/actions';

import scientists from '../data/scientists';
import ui from '../data/ui';

const scientistOptions = ui.scientists.map(name => ({
   text: scientists[name].name,
   value: name
 }));
 //     image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },

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
