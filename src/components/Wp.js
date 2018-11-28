import React, { Component } from 'react';

const wp_root = "https://en.wikipedia.org/wiki/";

class Wp extends Component {
  render() {
    return (
      <a target="_blank"
        rel="noopener noreferrer"
        href={ wp_root + this.props.lemma}
      >{this.props.children}</a>
    );
  }
}

export default Wp;
