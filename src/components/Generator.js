import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Item, Button, Statistic } from 'semantic-ui-react';

import Wp from './Wp.js';

import { registerHandler } from '../store/reducer.js';
import merge from 'deepmerge';

const pathToImg = require.context('../images/');

function mapStateToProps(state, ownProps)
{
  return {
    matter: state.matter,
    generatorKey: ownProps.generatorKey,
    generatorState: state.saved.generators[ownProps.generatorKey],
  };
}

export const updateGeneratorCount = registerHandler("updateGeneratorCount",
  (saved, generatorKey, newValue) => (merge(saved, {
     generators: { [generatorKey]: { count: newValue } },
  }))
);

const mapDispatchToProps = ({
   updateGeneratorCount
});


class Generator extends Component {
    render() {
      const matter = this.props.matter;
      const generatorKey = this.props.generatorKey;
      const generator = matter.generators[generatorKey];
      const generatorState = this.props.generatorState;
      const count = generatorState.count;
        
      return (
        <Item>
          <Item.Image size='tiny' src={pathToImg('./image.png')} />    
          <Item.Content>
            <Item.Header as="h3">{generator.name}</Item.Header>
            <Item.Meta>{generator.desc} <Wp lemma={generator.wp} /></Item.Meta>
              <Item.Description>
              <Statistic size='tiny'>
              <Statistic.Value>{count}</Statistic.Value>
              <Statistic.Label><Button.Group basic size='mini'>
              <Button
          disabled={count == 0}
                onClick={() => this.props.updateGeneratorCount(generatorKey, generatorState.count - 1) }
              >-1</Button><Button
              onClick={() => this.props.updateGeneratorCount(generatorKey, generatorState.count + 1) }
              >+1</Button>
              </Button.Group></Statistic.Label>
              </Statistic>
                <h4>Upgrades</h4>
                <ul>
              { Object.keys(matter.upgrades).filter((upgradeKey) => matter.upgrades[upgradeKey].effects.some((el) => el.generator === generatorKey)).map((upgradeKey) => <li key={upgradeKey}>{upgradeKey} <Button toggle size='mini'>Buy</Button></li>) }  
                </ul>
              </Item.Description>
            <Item.Extra>Extra</Item.Extra>
          </Item.Content>  
        </Item>
      );
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Generator);
