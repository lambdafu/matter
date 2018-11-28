import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Menu } from 'semantic-ui-react';

import { sagaMiddleware } from '../store';
import { loadState, saveState } from '../saga/state';


const mapStateToProps = (state) => {
  return {
    version: state.matter.version,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadState: () => sagaMiddleware.run(loadState),
    saveState: () => sagaMiddleware.run(saveState),
  }
}

class MatterMenu extends Component {
  render() {
      return (
          <Menu secondary>
            <Menu.Item header>Matter v{this.props.version}</Menu.Item>
            <Menu.Item onClick={this.props.loadState}>Load</Menu.Item>
            <Menu.Item onClick={this.props.saveState}>Save</Menu.Item>
          </Menu>
        );
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(MatterMenu);
