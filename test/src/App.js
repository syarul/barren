import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import store from 'barren'

function App(props) {
  const { store } = props 

  const count = store.fetch('counter')

  const userCount = store.fetch('users', 'usersCount')
  const userList = store.fetch('users', 'userList')

  useEffect(() => {
    console.log(userCount)
  }, [userCount])

  const [input, setInput] = useState('')

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
        <p>users count: {userCount}</p>
        <pre style={{textAlign: 'left', fontSize: 13}}>{userList && userList.length && JSON.stringify(userList, false, 2)}</pre>
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
