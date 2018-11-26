import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Divider, Button, Header, Popup, Icon } from 'semantic-ui-react';

import Wp from './Wp';
import TopicGrid from './TopicGrid';

import { SET_TOPIC } from '../store/actions';

import ui from '../data/ui';
import topics from '../data/topics';
import generators from '../data/generators';
import upgrades from '../data/upgrades';


 const mapStateToProps = (state) => {
   return {
       topic: state.ui.topic,
       item: state.ui.items[state.ui.topic]
   };
 }


 const mapDispatchToProps = (dispatch) => {
     return {
     setTopic: (id) => {
       dispatch(SET_TOPIC(id))
     }
   }
 }


class Laboratory extends Component {
  render() {
      const topic = topics[this.props.topic];
      const item = topic.items[this.props.item];
      const gridtype = topic.gridtype[item.gridtype];

      return (
          <div>
          <Header as='h1'>{topic.name}</Header>
          <p>{topic.desc} <Wp lemma={topic.wp}><Icon name="wikipedia w" /></Wp></p>

          <TopicGrid topic={topic} />

          <Divider horizontal>
          <Button.Group size="mini">
          { ui.topics.map((key) => <Popup key={key} trigger={
              <Button topic={ui}
                      active={topic.key == key}
                      onClick={() => this.props.setTopic(key)}
                >
                {topics[key].short}
              </Button>
            } content={topics[key].name} positioning='bottom left' />) }
          </Button.Group>
          </Divider>

          <div>
            <h2>{item.name} ({item.short})</h2>
            <p>{item.desc} <Wp lemma={item.wp}><Icon name="wikipedia w" /></Wp></p>

            <p>
            <Popup
               trigger={
                 <span><strong>{gridtype.name}</strong> <Wp lemma={gridtype.wp}><Icon name='wikipedia w'/></Wp></span>}
               header={gridtype.name}
               content={gridtype.desc}
               size='small'
             />
             </p>
             <ul>
              {
                (item.generators || []).map((key) => { const gen = generators[key];
              return <li key={gen.key}>{gen.name} <Wp lemma={gen.wp}><Icon name='wikipedia w'/></Wp></li>
           })}
           </ul>

           <ul>
            {
              (item.upgrades || []).map((key) => { const up = upgrades[key];
            return <li key={up.key}>{up.name} <Wp lemma={up.wp}><Icon name='wikipedia w'/></Wp></li>
         })}
         </ul>
        </div>

          </div>
        );
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Laboratory);
