# barren
A lightweight state management for React

## install
```npm i barren```

## usage

On the main/entry React component

```jsx
import StoreProvider from 'barren/lib/provider'

import createStore from 'barren/lib/createStore'

// should be imported elsewhere
const ACTION_STORE = {
    counter: function(param) {
        if(param === 'add') {
            this.STORE['counter'] += 1
        }
        if(param === 'reduce') {
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

  const count = store.fetch('counter')

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

## async

Usage sample using axios
```js
import { request, setConfig } from 'barren/api/axios-api'

setConfig({ baseURL: 'https://api.github.com/search'})

const ACTION_STORE = {
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
  // to process output from ACTION_STORE use function
  users: function(result = {}){
    const { 
      total_count = 0, 
      items = []
    } = result
    return {
      usersCount: total_count,
      userList: items
    }
  }
}
```

On children component
```jsx
import store from 'barren'

function App(props) {
  const { store } = props 

  const userCount = store.fetch('users', 'usersCount')
  const userList = store.fetch('users', 'userList')

  const [input, setInput] = useState('')

  const onChange = e => {
    setInput(e.target.value)
  }

  function searchUsers(){
    store.dispatch('users', { users: input })
  }

  return (
    <div>
      <input onChange={onChange}/>
      <button onClick={searchUsers}>search github users</button>
      <p>users count: {userCount}</p>
      <pre>
        {userList && userList.length && JSON.stringify(userList, false, 2)}
      </pre>
    </div>
  )
}

export default store(App)
```


## api
```js
store.dispatch(action, params, options, caller)
```
dispatch an action from ACTION_STORE

* **action:** *(object)* A valid string identifier, should be unique.
* **params:** *(any types)* Parameter to pass to the dispatcher event reference.
* **options:** *(object, optional)* Options parameter for the dispatcher.
* **caller:** *(function, optional)* Callback function to run after the dispatcher event finish.

### options parameter
* **forceRewrite** *(boolean)* Force rewriting the store cache on request.
* **shallowUpdate** *(boolean)* Once request is made do not cache to the store.
* **timeout** *(integer)* Custom timeout for for dispatcher request.
* **event** *(boolean)* Dispatch as event to listeners.
* **inflightRequestCancellation** *(boolean)* Assign request cancellation handler to the dispatcher.

```js
store.fetch(action, param)
```
fetch result from STORE

* **action:** *(string)* A valid string identifier, should be unique.
* **param:** *(string, optional)* Property name of the result if is a valid object.

```js
store.clearCache(action)
```
flag an action to process next request

* **action:** *(string)* A valid string identifier, should be unique.

```js
store.clearAllCache()
```
flag all actions to process all incoming request

```js
store.overrideStore (action, value)
```
override the store cache value

* **action:** *(string)* A valid string identifier, should be unique.
* **value:** *(any types)* New value for the reassignment.

```js
forceEvent (event, params)
```
forcefully emit an event

* **event:** *(string)* A valid string identifier, should be unique.
* **params:** *(any types)* Value to pass to the event.


