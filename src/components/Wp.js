import React, { Component } from 'react';

// import { Icon } from 'semantic-ui-react';

class Wp extends Component {
  render() {
      return (
          <a target="_blank" rel="noopener noreferrer" href={ "https://en.wikipedia.org/wiki/" + this.props.lemma}>{this.props.children}</a>
          // <Icon size='small' name="wikipedia w" />
        );
      }
    }

export default Wp;
