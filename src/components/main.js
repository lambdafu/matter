import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'

import MatterMenu from './menu';
import Notebook from './notebook';
import Laboratory from './laboratory';

class Main extends Component {
  render() {
      return (
          <div>
              <MatterMenu />
              <Grid padded>
              <Grid.Row>
                  <Grid.Column width={6}>
                  <Notebook />
                  </Grid.Column>
                  <Grid.Column width={10}>
                  <Laboratory />
                  </Grid.Column>
             </Grid.Row>
             </Grid>
          </div>
        );
      }
    }

export default Main;
