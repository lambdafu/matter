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
    prediction: state.saved.prediction ? state.saved.prediction.result : undefined,
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
      const prediction = this.props.prediction;

      const upgrades = Object.keys(matter.upgrades).filter((upgradeKey) => matter.upgrades[upgradeKey].effects.some((el) => el.generator === generatorKey));

      return (
        <Item>
          <Item.Image size='tiny' src={pathToImg('./image.png')} />    
          <Item.Content>
            <Item.Header as="h3">{generator.name}</Item.Header>
            <Item.Meta>{generator.desc} <Wp lemma={generator.wp} /></Item.Meta>
              <Item.Description>
          { (Object.keys(generator.outputs).length !== 0) &&
            <div>Produces:
            <ul>
            { Object.entries(generator.outputs).map(([output, amount]) => <li key={output}>{amount} {matter.items[output].name}</li>) }
            </ul>
            </div>
          }
          {          // FIXME: To know which inputs reduce the efficiency, we have to
          // bump the stock of each item individually and rerun the
          // prediction logic to see if the utilization increases.
          // That's a bit expensive, so maybe we should do this only
          // when a button is pressed or so?  Could be a game feature.

              (Object.keys(generator.inputs).length !== 0) &&
            <div>Consumes:
            <ul>
            { Object.entries(generator.inputs).map(([input, amount]) => <li key={input}>{amount} {matter.items[input].name}</li>) }
            </ul>
            </div>
          }
          { (Object.keys(generator.inputs).length !== 0 && prediction !== undefined && prediction.generators[generatorKey].utilizationMax !== 0) &&
            <div>Efficiency: { Math.trunc(100 * prediction.generators[generatorKey].utilization) }%</div>
          }

              <Statistic size='tiny'>
              <Statistic.Value>{count}</Statistic.Value>
              <Statistic.Label><Button.Group basic size='mini'>
              <Button
          disabled={count === 0}
                onClick={() => this.props.updateGeneratorCount(generatorKey, generatorState.count - 1) }
              >-1</Button><Button
              onClick={() => this.props.updateGeneratorCount(generatorKey, generatorState.count + 1) }
              >+1</Button>
              </Button.Group></Statistic.Label>
              </Statistic>
              {
                  (upgrades.length > 0) &&
                      <div><h4>Upgrades</h4>
                      <ul>
                      { upgrades.map((upgradeKey) => <li key={upgradeKey}>{matter.upgrades[upgradeKey].name} <Button toggle size='mini'>Buy</Button></li>) }
                  </ul></div>
              }
              </Item.Description>
              { false && <Item.Extra>Extra</Item.Extra> }
          </Item.Content>  
        </Item>
      );
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Generator);
