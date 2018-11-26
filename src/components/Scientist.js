import React, { Component } from 'react';

import { Card, Label, Icon, Popup } from 'semantic-ui-react'

import Wp from './Wp';

import achievements from '../data/achievements.json';
import scientists from '../data/scientists.json';

const pathToImg = require.context('../images/scientist/');

class Scientist extends Component {
  render() {
      const scientist = scientists[this.props.name];
      const extra = (
        <Label.Group>
         {scientist.achievements.map(medal => (
          <Popup
             key={achievements[medal].name}
             trigger={<Label><Icon name={achievements[medal].icon} />{achievements[medal].name}</Label>}
             header={achievements[medal].name}
             content={achievements[medal].info}
             size='small'
           />
         ))}
        </Label.Group>
      );

      return (
        <Card
          style={{width: 'auto'}}
          image={pathToImg('./' + scientist.image)}
          header={<Wp lemma={scientist.wp}>{scientist.name}</Wp>}
          meta={scientist.title}
          description={<em><Wp lemma={scientist.tagline_wp}>{scientist.tagline}</Wp></em>}
          extra={extra}
        />
      );
      }
    }

export default Scientist;
