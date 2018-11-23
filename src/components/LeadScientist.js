import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Dropdown } from 'semantic-ui-react';

import Scientist from './Scientist';

import { SET_SCIENTIST } from '../store/actions';

import scientists from '../data/scientists.json';

const scientistOptions = Object.keys(scientists).map(name => ({
   text: scientists[name].name,
   value: name
 }));
 //     image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },

 const mapStateToProps = (state) => {
   return {
       lead: state.ui.scientist
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
    console.log("X", this.props.lead);
         return (
           <div>
           <Dropdown fluid placeholder='Select Lead Scientist' selection options={scientistOptions}
         onChange={(e, {value}) => this.props.setLead(value)}
         value={this.props.lead} />
         <Scientist name={this.props.lead} />
       </div>);
       }
    }

export default connect(mapStateToProps, mapDispatchToProps)(LeadScientist);
