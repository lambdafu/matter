import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Divider, Button, Header, Popup, Icon } from 'semantic-ui-react';

import Wp from './Wp';
import TopicGrid from './TopicGrid';

import { SET_TOPIC } from '../store/actions';

import ui from '../data/ui';
import topics from '../data/topics';


 const mapStateToProps = (state) => {
   return {
       topic: state.ui.topic
   };
 }


 const mapDispatchToProps = (dispatch) => {
     return {
     setTopic: (id) => {
       dispatch(SET_TOPIC(id))
     }
   }
 }

//className={classNames("tab-pane", "fade", {"active": ui.active_topic == topic.key})}

// let GridtypeTabContent = ({topic, gridtype, ui}) =>
//     {
//         let _gridtype = topic.gridtype[gridtype];
//         return <p className="gridtype-sum"><span className="gridtype-sum-name">{_gridtype.name},</span> <span className="gridtype-sum-desc"><span className="gridtype-sum-desc-first-letter">{_gridtype.desc[0]}</span>{_gridtype.desc.substring(1)}</span> <Wp className="wp" lemma={_gridtype.wp}/></p>
//     }
//
//
//     let ItemTabContent = ({topic, item, ui}) =>
//         {
//             let _item = topic.items[item];
//             return <p className="item-sum"><span className="item-sum-name">{_item.name},</span> <span className="item-sum-desc"><span className="item-sum-desc-first-letter">{_item.desc[
//     0]}</span>{_item.desc.substring(1)}</span> <Wp className="wp" lemma={_item.wp}/></p>
//         }
// <GridtypeTabContent gridtype={topic.items[ui.active_item[ui.active_topic]].gridtype} topic={topic} ui={ui} />
// <ItemTabContent item={ui.active_item[ui.active_topic]} topic={topic} ui={ui} />


class Laboratory extends Component {
  render() {
      const topic = topics[this.props.topic];

      return (
          <div>
          <Header as='h1'>{topic.name}</Header>
          <p>{topic.desc} <Wp className="wp" lemma={topic.wp}><Icon name="wikipedia w" /></Wp></p>

          <TopicGrid topic={topic} />

          <Divider horizontal>
          <Button.Group size="mini">
          { ui.topics.map((key) => <Popup trigger={
              <Button key={key}
                      topic={ui}
                     active={topic.key == key}
                      onClick={() => this.props.setTopic(key)}
                >
                {topics[key].short}
              </Button>
            } content={topics[key].name} positioning='bottom left' />) }
          </Button.Group>
          </Divider>

          <div className="tab-content">
</div>


          </div>
        );
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Laboratory);
