import React from 'react';
import logo from './logo.svg';
import './App.css';

import store from 'barren'

function App(props) {
  const { store } = props 

  const count = store.getData('counter')

  function add(){
    store.dispatch('counter', 'add')
  }

  function reduce(){
    store.dispatch('counter', 'reduce')
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div style={{display: 'flex'}}>
          <button onClick={reduce}> - </button> {count} <button onClick={add}> + </button>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default store(App);
