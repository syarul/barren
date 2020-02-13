import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

/**
 * Store Provider to handle state management
 * for children components.
 *
 * To use the store wrap the component `store(ComponentToWrap)`
 *
 */
import StoreProvider from 'barren/lib/provider'

/**
 * The Store instance
 * updateContext will trigger the DOM tree rendering when called
 * since store can received update asynchronously we want to ensure
 * all childrens will apply these updates
 */
import createStore from 'barren/lib/createStore'

import { request, setConfig } from 'barren/api/axios-api'

setConfig({ baseURL: 'https://api.github.com/search'})

const ACTION_STORE = {
	counter: function(param) {
		if(param === 'add') {
			this.STORE['counter'] += 1
		}
		if(param === 'reduce') {
			this.STORE['counter'] -= 1
		}
	},
	users: function(params = {}){
		const {
			users = 'tom',
			repos = 1,
			followers = 1
		} = params
		const query = `users?q=${users}+repos:>${repos}+followers:>${followers}`
		return request(query)
	}
}

const STORE = {
	counter: 0,
	users: function(result){
		const { 
			total_count = 0, 
			items = []
		} = result || {}
		return {
			usersCount: total_count,
			userList: items
		}
	}
}

const barren = createStore(ACTION_STORE, STORE)

const { store } = barren

store.DEBUG_MODE = true

ReactDOM.render(
	<StoreProvider {...barren} >
      <App />
    </StoreProvider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
