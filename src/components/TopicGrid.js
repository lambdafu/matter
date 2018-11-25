import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { Table, Popup } from 'semantic-ui-react';

import Wp from './Wp';

import './TopicGrid.css';


//
class GridCellItem extends Component {
render() {
  const topic = this.props.topic;
  const item = topic.items[this.props.item];
  const active = this.props.active;

  return (
    <Popup trigger={
      <div className={ classNames({cell: true, active: active}) }
       style={{ backgroundColor: topic.gridtype[item.gridtype].color }} >
       { item.short }</div>}
        header={item.name}
        content={item.desc}
        positioning="bottom left" />
  );
}
}

class GridCellEmpty extends Component {
  render() {
      const item = this.props.item;
      return (<div className='cell empty' />);
  }
}


const mapStateToProps = (state) => {
   return {
       activeItem: state.ui.items[state.ui.topic]
   };
 }

class GridCellImpl extends Component {
  render() {
    const topic = this.props.topic;
    const item = this.props.item;
    const activeItem = this.props.activeItem;

    if (item === null) {
	    return <GridCellEmpty topic={topic} item={item} />
    } else {
	    return <GridCellItem topic={topic} item={item} active={activeItem == item}/>
    }
}}

const GridCell = connect(mapStateToProps)(GridCellImpl);

class GridRow extends Component {
  render() {
    const topic = this.props.topic;
    const items = this.props.items;
    const active_item = 'm';

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
