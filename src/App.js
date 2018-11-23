import React, { Component } from 'react';
import Main from './components/main';

import './App.css';

import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Main />
      </div>
    );
  }
}

export default App;
