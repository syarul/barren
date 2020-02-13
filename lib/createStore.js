const clone = require('clone')
const { assert, assign, equal } = require('./utils.js')

const UpdateContext = require('./updateContext.js')

class CreateStore {
  constructor (ACTION_STORE, STORE, updateContext) {
    assert(typeof ACTION_STORE === 'object', 'Action Store is not a javascript object.')
    assert(typeof STORE === 'object', 'Store is not a javascript object.')
    // initalize action store
    this.ACTION_STORE = ACTION_STORE

    // cache params
    this._cacheParams = {}

    // initialize store
    this.STORE = STORE

    // store intermidary
    this._intermStore = {}

    // we can set this in debug mode to trace dispatcher output
    this.DEBUG_MODE = false

    this.updateContext = updateContext
  }

  // register a new store
  registerStore (STORE = {}) {
    assert(typeof STORE === 'object', 'Store is not a javascript object.')
    this.STORE = STORE
  }

  // register a new action store
  registerActionStore (ACTION_STORE = {}) {
    assert(typeof ACTION_STORE === 'object', 'Action Store is not a javascript object.')
    this.ACTION_STORE = ACTION_STORE
  }


  delegate(action, params, options, caller, result, shouldCache){

    const { STORE, _cacheParams, _intermStore } = this
    // request debugging
    if (process.env.NODE_ENV === 'development' && this.DEBUG_MODE) { console.log(result) }

    // Cache the request result. If the target store is
    // an object we pass it directly. If it's a function 
    // handler that modify the output, return it to the 
    // intermidary store instead.
    if (!options.shallowUpdate) {
      if(typeof STORE[action] !== 'function'){
        assign(STORE[action], result)
      } else {
        const intermHandler = STORE[action]
        const intermResult = intermHandler.call(this, result) || {}
        _intermStore[action] = _intermStore[action] || {}
        assign(_intermStore[action], intermResult)
      }
    }

    // cache the request parameter
    if (shouldCache) {
      _cacheParams[action] = clone(params)
    }

    // internal method to tell react component of this update
    this.updateContext.emit('__barren__', (caller && typeof caller === 'function' && caller.bind(null, result)))

    // emit to all listeners of this action
    if (options.event) {
      this.updateContext.emit(action, result)
    }

    return result
  }

  // action dispatcher
  // @params - action - the action indentifier
  // @params - params - the parameter to pass
  // @params - options - (optional) extra options to pass to the dispatcher
  // @params - caller - (optional) callback event once the dispatch event finish
  dispatch (action, params, options, caller) {
    const { ACTION_STORE, STORE, _cacheParams } = this

    options = options || {
      forceRewrite: false, // force rewriting the cache on request
      shallowUpdate: false, // once request is made do not cache to the store
      timeout: false, // custom timeout for request
      event: false, // dispatch as event to listeners
      inflightRequestCancellation: false // assign request cancellation handler to the dispatcher
    }

    if (ACTION_STORE[action]) {
      assert(typeof ACTION_STORE[action] === 'function', 'Action is not a function.')

      const request = ACTION_STORE[action]

      // execute the request if it is a promise
      if (!equal(_cacheParams[action], params) || options.forceRewrite) {
        const defer = request.call(this, params, options)

        if (defer instanceof Promise) {
          return defer.then(result => this.delegate(action, params, options, caller, result, true))
        } else {
          return this.delegate(action, params, options, caller, defer, false)
        }
      } else {
        const result = STORE[action] || {}
        caller && typeof caller === 'function' && caller(result)
        return result
      }
    }
  }

  clearCache (action) {
    if (this._cacheParams[action] !== undefined) {
      this._cacheParams[action] = undefined
    }
  }

  clearAllCache () {
    Object.keys(this._cacheParams).forEach(action => {
      this._cacheParams[action] = undefined
    })
  }

  fetch (action, param) {
    assert(typeof action === 'string', 'First argument type not a string.')

    const { STORE, _intermStore } = this
    
    if(param){
      assert(typeof param === 'string', 'Second argument type not a string.')
      if(typeof STORE[action] === 'function'){
        return ((_intermStore[action] && _intermStore[action][param]) || null)
      }
      return ((STORE[action] && STORE[action][param]) || null)
    } else {
      if(typeof STORE[action] === 'function'){
        return _intermStore[action]
      }
      return STORE[action]
    }
  }

  overrideStore (action, value) {
    this.STORE[action] = { ...this.STORE[action], ...value }
  }

  forceEvent (event, params) {
    this.updateContext.emit(event, params)
  }
}

module.exports = function (actionStore, _store) {
  const updateContext = new UpdateContext()

  const store = new CreateStore(actionStore, _store, updateContext)

  return {
    store,
    updateContext
  }
}
