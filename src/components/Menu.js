import React, { Component } from 'react';
import { sagaMiddleware } from '../store';
import { loadState, saveState } from '../saga/state';

import { Menu } from 'semantic-ui-react';

import { version } from '../../package.json';

class MatterMenu extends Component {
  render() {
      return (
          <Menu>
            <Menu.Item header>Matter v{version}</Menu.Item>
            <Menu.Item onClick={() => sagaMiddleware.run(loadState)}>Load</Menu.Item>
            <Menu.Item onClick={() => sagaMiddleware.run(saveState)}>Save</Menu.Item>
          </Menu>
        );
      }
    }

export default MatterMenu;
