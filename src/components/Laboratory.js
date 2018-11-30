import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Divider, Button, Header, Popup, Icon } from 'semantic-ui-react';
import Wp from './Wp';
import TopicGrid from './TopicGrid';

import { registerHandler } from '../store';

export const setTopic = registerHandler("setTopic",
  (state, topic) => ({ ...state, topic }));

 const mapStateToProps = (state) => {
   return {
       matter: state.matter,
       topic: state.saved.topic,
       item: state.saved.items[state.saved.topic]
   };
 }

 const mapDispatchToProps = ({
    setTopic
 });

class Laboratory extends Component {
  render() {
      const matter = this.props.matter;
      const topic = matter.topics[this.props.topic];
      const item = topic.items[this.props.item];
      const gridtype = topic.gridtype[item.gridtype];

      return (
          <div>
          <Header as='h1'>{topic.name}</Header>
          <p>{topic.desc} <Wp lemma={topic.wp}><Icon name="wikipedia w" /></Wp></p>

          <TopicGrid topic={topic} />

          <Divider horizontal>
          <Button.Group size="mini">
          { matter.ui.topics.map((key) => <Popup key={key} trigger={
              <Button topic={matter.ui}
                      active={topic.key === key}
                      onClick={() => this.props.setTopic(key)}
                >
                {matter.topics[key].short}
              </Button>
            } content={matter.topics[key].name} positioning='bottom left' />) }
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
                //(generators.filter((gen) => gen.output.some((out) => out.item === item.key)))
                (item.generators || []).map((key) => { const gen = matter.generators[key];
              return <li key={gen.key}>{gen.name} <Wp lemma={gen.wp}><Icon name='wikipedia w'/></Wp></li>
           })}
           </ul>

           <ul>
            {
              (item.upgrades || []).map((key) => { const up = matter.upgrades[key];
            return <li key={up.key}>{up.name} <Wp lemma={up.wp}><Icon name='wikipedia w'/></Wp></li>
         })}
         </ul>
        </div>

          </div>
        );
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Laboratory);
