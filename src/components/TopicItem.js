import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Item, Button, Icon, Popup } from 'semantic-ui-react';

import Wp from './Wp.js';
import Generator from './Generator.js';

function mapStateToProps(state, ownProps)
{
  return {
    matter: state.matter,
    itemKey: ownProps.itemKey,
    itemState: state.saved.items[ownProps.itemKey],
  };
}

class MatterItem extends Component {
    render() {
      const matter = this.props.matter;
      const item = matter.items[this.props.itemKey];
      const itemState = this.props.itemState;

      return (
        <div>
          <h2>{item.name} ({item.short})</h2>
          <p>{item.desc} <Wp lemma={item.wp} /></p>
          <p>Count: {Math.trunc(itemState.count)}</p>
          <h3>Generators</h3>
          <Item.Group divided unstackable>
              { Object.keys(matter.generators).map((gen) => <Generator key={gen} generatorKey={gen}/>) }  
          </Item.Group>
        </div>
      );
      }
    }

export default connect(mapStateToProps)(MatterItem);
