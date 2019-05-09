import React, { Component } from 'react';

import {
  Icon,
} from 'semantic-ui-react';

const wp_root = 'https://en.wikipedia.org/wiki/';

class Wp extends Component {
  static defaultProps = { children: <Icon name='wikipedia w' /> }

  render() {
    return (
      <a target='_blank'
        rel='noopener noreferrer'
        href={ wp_root + this.props.lemma}
      >{this.props.children}</a>
    );
  }
}

export default Wp;
