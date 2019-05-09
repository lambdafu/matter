import React, { Component } from 'react';
import { connect } from 'react-redux';

import TopicDisplay from './TopicDisplay.js';
import TopicSelector from './TopicSelector.js';
import TopicItem from './TopicItem.js';

const mapStateToProps = (state) => {
  const topicKey = state.saved.active.topic;
  const itemKey = state.saved.active.item[topicKey];
  return {
    topicKey: topicKey,
    itemKey: itemKey,
  };
};

class Laboratory extends Component {
  render() {
    const topicKey = this.props.topicKey;
    const itemKey = this.props.itemKey;

    return (
      <div>
        <TopicDisplay topicKey={topicKey} />
        <TopicSelector />
        <TopicItem itemKey={itemKey} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(Laboratory);
