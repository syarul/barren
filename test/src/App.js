import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import store from 'barren'

function App(props) {
  const { store } = props 

  const count = store.getData('counter')

  const deferUsers = store.getData('users')

  const [input, setInput] = useState('')

  const [users] = useState(deferUsers)

  function add(){
    store.dispatch('counter', 'add')
  }

  function reduce(){
    store.dispatch('counter', 'reduce')
  }

  const onChange = e => {
    setInput(e.target.value)
  }

  function searchUsers(){
    store.dispatch('users', { users: input })
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
        <input onChange={onChange}/><button onClick={searchUsers}>search github users</button>
        <pre style={{textAlign: 'left', fontSize: 13}}>{JSON.stringify(users, false, 2)}</pre>
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
