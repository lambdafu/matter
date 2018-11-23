import React, { Component } from 'react';

import { Menu } from 'semantic-ui-react';

class MatterMenu extends Component {
  render() {
      return (
          <Menu>
            <Menu.Item header>Matter v1.0</Menu.Item>
            <Menu.Item>Load</Menu.Item>
            <Menu.Item>Save</Menu.Item>
          </Menu>
        );
      }
    }

export default MatterMenu;
