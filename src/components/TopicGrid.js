import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import { Popup } from 'semantic-ui-react';

import { registerHandler } from '../store/reducer.js';
import merge from 'deepmerge';

import './TopicGrid.css';

const mapStateToProps = (state) => {
  return {
    activeItem: state.saved.active.item[state.saved.active.topic],
    matter: state.matter,
    itemStates: state.saved.items,
    prediction: state.saved.prediction ? state.saved.prediction.result : undefined,
  };
};

export const setTopicItem = registerHandler("setTopicItem",
  (state, topicKey, itemKey) => (merge(state, {
    active: { item: { [topicKey]: itemKey } },
  }))
);

const mapDispatchToProps = ({
   setTopicItem
});

class GridCellItemImpl extends Component {
render() {
  const matter = this.props.matter;
  const topic = this.props.topic;
  const itemKey = this.props.itemKey;
  const item = this.props.matter.items[itemKey];
  const activeItem = this.props.activeItem;
  const itemStates = this.props.itemStates;

    // const prediction = this.props.prediction;
    //             <span className='utilization'>{(prediction !== undefined && prediction[itemKey].maxdelta != 0) ? Math.trunc(100 * prediction[itemKey].delta / Math.abs(prediction[itemKey].maxdelta)) : 0}%</span>

  return (
    <Popup trigger={
      <div className={ classNames({cell: true, active: activeItem === itemKey}) }
       style={{ backgroundColor: matter.categories[item.category].color }}
       onClick={() => this.props.setTopicItem(topic.key, itemKey) }
            ><p>{ item.short }<span className='count'>{Math.trunc(itemStates[itemKey].count)}</span>
            </p></div>}
         header={item.name}
         content={item.desc}
         positioning="bottom left" />
  );
}
}

const GridCellItem = connect(mapStateToProps, mapDispatchToProps)(GridCellItemImpl);


class GridCellEmpty extends Component {
  render() {
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
	    return <GridCellItem topic={topic} itemKey={item} />;
    }
}}


class GridRow extends Component {
  render() {
    const topic = this.props.topic;
    const items = this.props.items;

    return (
      <div className='row'>
        { items.map((itemkey, col) =>
          <GridCell key={col} topic={topic} item={itemkey} />)}
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
          <GridRow key={row} topic={topic} items={items} />)}
      </div>
    );
  }
}

export default TopicGrid;
