import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Button,
  Divider,
  Popup,
} from 'semantic-ui-react';

import { registerHandler } from '../store/reducer.js';
import merge from 'deepmerge';

export const setTopic = registerHandler('setTopic',
  (state, topic) => (merge(state, {
    active: { topic }
  }))
);

const mapStateToProps = (state) => {
  const topic = state.saved.active.topic;
  return {
    matter: state.matter,
    topicKey: state.saved.active.topic,
  };
};

const mapDispatchToProps = ({
  setTopic,
});

class TopicSelector extends Component {
  render() {
    const matter = this.props.matter;
    const topicKey = this.props.topicKey;
      
    return (
      <Divider horizontal>
        <Button.Group size='mini'>
          { matter.ui.topics.map((key) =>
            <Popup key={key} trigger={
              <Button active={key === topicKey}
                      onClick={() => this.props.setTopic(key)}>
                { matter.topics[key].short }
              </Button>
        } content={matter.topics[key].name} positioning='bottom left' />) }
      </Button.Group>
    </Divider>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopicSelector);
