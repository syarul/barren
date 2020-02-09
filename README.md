# barren
A lightweight state management for React

**Work In Progress**

## install
```npm i barren```

## usage

On the main/entry React component

```jsx
import StoreProvider from 'barren/provider'

import createStore from 'barren/createStore'

// should be imported elsewhere
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

// should be imported elsewhere
const STORE = {
    counter: 0
};

const barren = createStore(ACTION_STORE, STORE)

ReactDOM.render(
    <StoreProvider {...barren}>
      <App />
    </StoreProvider>,
document.getElementById('root'))
```

On children component

```jsx
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
    <div style={{display: 'flex'}}>
      <button onClick={reduce}> - </button> {count} <button onClick={add}> + </button>
    </div>
  );
}

export default store(App)
```

## api
```js
store.dispatch(action, params, options, caller)
```

* **action:** *(object)* A valid string identifier, should be unique.
* **params:** *(any types)* parameter to pass to the dispatcher events reference.
* **options:** *(object, optional)* options parameter for the dispatcher.
* **caller:** *(function, optional)* callback function to run after the dispatcher event finish.

### options parameter
* **forceRewrite** *(boolean)* force rewriting the store cache on request.
* **shallowUpdate** *(boolean)* once request is made do not cache to the store.
* **timeout** *(integer)* custom timeout for for dispatcher request.
* **event** *(boolean)* dispatch as event to listeners.
* **inflightRequestCancellation** *(boolean)* assign request cancellation handler to the dispatcher.

