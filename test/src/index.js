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
import StoreProvider from 'barren/provider'

/**
 * The Store instance
 * updateContext will trigger the DOM tree rendering when called
 * since store can received update asynchronously we want to ensure
 * all childrens will apply these updates
 */
import createStore from 'barren/createStore'

const ACTION_STORE = {
	counter: function(action) {
		if(action === 'add') {
			this.STORE['counter'] += 1
		}
		if(action === 'reduce') {
			this.STORE['counter'] -= 1
		}
	}
}

const STORE = {
	counter: 0
}

const barren = createStore(ACTION_STORE, STORE)

ReactDOM.render(
	<StoreProvider {...barren} >
      <App />
    </StoreProvider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
