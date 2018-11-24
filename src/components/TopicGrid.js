import React, { Component } from 'react';
import { connect } from 'react-redux';
//import classNames from 'classnames/bind';

import { Table, Popup } from 'semantic-ui-react';

import Wp from './Wp';



//className={ classNames({active: active_item==item.key}) }
class GridCellItem extends Component {
render() {
  const topic = this.props.topic;
  const item = this.props.item;
  const row = this.props.row;
  const col = this.props.col;
  return (
    <Popup trigger={
      <Table.Cell key={ col } style={{ backgroundColor: topic.gridtype[item.gridtype].color }}>
      { item.short }</Table.Cell>}
  header={item.name}
        content={item.desc}
       positioning="bottom left" />
  );
}
}

class GridCellEmpty extends Component {
  render() {
      return (<Table.Cell />);
  }
}

class GridCell extends Component {
  render() {
    const topic = this.props.topic;
    const item = this.props.item;
    const row = this.props.row;
    const col = this.props.col;
        if (item === undefined) {
    	    return <GridCellEmpty key={col} topic={topic} row={row} col={col} />
        } else {
      	    return <GridCellItem key={col} topic={topic} item={item} row={row} col={col} />
        }
  }}

class GridRow extends Component {
  render() {
    const topic = this.props.topic;
    const items = this.props.items;
    const row = this.props.row;
    const col = this.props.col;
    return (
      <Table.Row>
        { items.map((itemkey, col) =>
      		  <GridCell key={col} topic={topic} item={topic.items[itemkey]} row={row} col={col}/>
      		 )
        }
     </Table.Row>
   );
  }
}

class TopicGrid extends Component {
  render() {
    const topic = this.props.topic;
    return (
    <Table style={{display: 'inline-block', width: 'auto' }} compact={topic.gridui.compact} celled={topic.gridui.celled} size={topic.gridui.size}>
    <Table.Body>
      { topic.grid.map((items, row) =>
         <GridRow key={row} topic={topic} row={row} items={items} /> )}
    </Table.Body>
    </Table>
  );
}
}

export default TopicGrid;
