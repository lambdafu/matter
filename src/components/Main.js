import React, { Component } from 'react';
import { Grid, Container } from 'semantic-ui-react';

import Menu from './Menu.js';
import Notebook from './Notebook.js';
import Laboratory from './Laboratory.js';

class Main extends Component {
  render() {
    return (
      <div>
        <Menu />
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={5}>
                <Notebook />
              </Grid.Column>
              <Grid.Column  mobile={16} tablet={16} computer={11}>
                <Laboratory />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default Main;
