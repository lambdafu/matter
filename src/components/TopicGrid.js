import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { Table, Popup } from 'semantic-ui-react';

import Wp from './Wp';

import { SET_TOPIC_ITEM } from '../store/actions';

import './TopicGrid.css';

const mapStateToProps = (state) => {
   return {
       activeItem: state.ui.items[state.ui.topic]
   };
 }

 const mapDispatchToProps = (dispatch) => {
     return {
     setTopicItem: (topic, item) =>
       dispatch(SET_TOPIC_ITEM(topic, item))
     }

 }

class GridCellItemImpl extends Component {
render() {
  const topic = this.props.topic;
  const item = topic.items[this.props.item];
  const activeItem = this.props.activeItem;

//  const activeItem = this.props.activeItem;

  return (
    <Popup trigger={
      <div className={ classNames({cell: true, active: activeItem === item.key}) }
       style={{ backgroundColor: topic.gridtype[item.gridtype].color }}
       onClick={() => this.props.setTopicItem(topic.key, item.key) }
        >
       { item.short }</div>}
        header={item.name}
        content={item.desc}
        positioning="bottom left" />
  );
}
}

const GridCellItem = connect(mapStateToProps, mapDispatchToProps)(GridCellItemImpl);


class GridCellEmpty extends Component {
  render() {
      const item = this.props.item;
      return (<div className='cell empty' />);
  }
}



class GridCell extends Component {
  render() {
    const topic = this.props.topic;
    const item = this.props.item;

    if (item === null) {
	    return <GridCellEmpty topic={topic} item={item} />
    } else {
	    return <GridCellItem topic={topic} item={item} />;
    }
}}


class GridRow extends Component {
  render() {
    const topic = this.props.topic;
    const items = this.props.items;

    return (
      <div className='row'>
        { items.map((itemkey, col) =>
      		  <GridCell key={col} topic={topic} item={itemkey} />
      		 )
        }
     </div>
   );
  }
}

class TopicGrid extends Component {
  render() {
    const topic = this.props.topic;

    const grid = topic.grid;

    return (
      <div className={ 'topicgrid ' + topic.gridui.class}>
      { grid.map((items, row) =>
         <GridRow key={row} topic={topic} items={items} /> )}
      </div>
  );
}
}

export default TopicGrid;
