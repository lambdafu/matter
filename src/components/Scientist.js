import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Card, Label, Icon, Popup } from 'semantic-ui-react';

import Wp from './Wp.js';

const pathToImg = require.context('../images/scientist/');

function mapStateToProps(state, ownProps)
{
  return {
    scientist: state.matter.scientists[ownProps.tag],
    achievements: state.matter.achievements,
  };
}

class Scientist extends Component {
  render() {
      const scientist = this.props.scientist;
      const achievements = this.props.achievements;

      const extra = (
        <Label.Group>
         {scientist.achievements.map(medal => (
          <Popup
             key={medal}
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

export default connect(mapStateToProps)(Scientist);
