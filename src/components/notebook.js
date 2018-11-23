import React, { Component } from 'react';

import { Segment, Dropdown } from 'semantic-ui-react'

import Scientist from './scientist';

import scientists from '../data/scientists.json';

const scientistOptions = Object.keys(scientists).map(name => ({
   text: scientists[name].name,
   value: name
 }));
//     image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },

const DropdownExampleSelection = () => (
  <Dropdown fluid placeholder='Select Lead Scientist' selection options={scientistOptions} />
);

class Notebook extends Component {
  render() {
      return (
        <div style={ {width: 290} }>
          <DropdownExampleSelection />
          <Segment basic vertical>
            <Scientist name="curie" />
          </Segment>
          <Segment basic vertical>
          I saved my progress to continue another day...
          </Segment>
        </div>
      );
      }
    }

export default Notebook;
