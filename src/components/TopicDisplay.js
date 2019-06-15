import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Header,
} from 'semantic-ui-react';

import Wp from './Wp.js';
import TopicGrid from './TopicGrid.js';

const mapStateToProps = (state) => {
  return {
    matter: state.matter,
  };
};

class TopicDisplay extends Component {
  render() {
    const matter = this.props.matter;
    const topic = matter.topics[this.props.topicKey];

    return (
      <div>
        <Header as='h1'>{topic.name}</Header>
        <p>{topic.desc} <Wp lemma={topic.wp} /></p>

        <TopicGrid topic={topic} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(TopicDisplay);
