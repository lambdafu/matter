import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';

import Scientist from './Scientist';
import LeadScientist from './LeadScientist';

class Notebook extends Component {
  render() {
      return (
        <div style={ {width: 290} }>
          <LeadScientist />
          <Segment basic vertical>
          I saved my progress to continue another day...
          </Segment>
        </div>
      );
      }
    }

export default Notebook;
