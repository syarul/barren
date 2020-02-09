const clone = require('clone')
const { assert, assign, equal } = require('./utils.js')

const UpdateContext = require('./updateContext.js')

const updateContext = new UpdateContext()

class CreateStore {

  constructor (ACTION_STORE = {}, STORE = {}) {

    assert(typeof ACTION_STORE === 'object', 'Action Store is not a javascript object.')
    assert(typeof STORE === 'object', 'Store is not a javascript object.')

    // initalize action store
    this.ACTION_STORE = ACTION_STORE

    //cache params
    this._cacheParams = {}

    // initialize store
    this.STORE = STORE

    // we can set this in debug mode to trace dispatcher output
    this.DEBUG_MODE = false
  }

  // register a new store
  registerStore(STORE = {}) {
    assert(typeof STORE === 'object', 'Store is not a javascript object.')
    this.STORE = STORE
  }

  // register a new action store
  registerActionStore(ACTION_STORE = {}) {
    assert(typeof ACTION_STORE === 'object', 'Action Store is not a javascript object.')
    this.ACTION_STORE = ACTION_STORE
  }

  delegate(action, params, options, caller, result){

    const { STORE, _cacheParams } = this
    // request debugging
    if (process.env.NODE_ENV === 'development' && this.DEBUG_MODE) { console.log(result) }

    // cache the request result
    if (!options.shallowUpdate) {
      assign(STORE[action], result)
    }

    // cache the request parameter
    _cacheParams[action] = clone(params)

    // internal method to tell react component of this update
    updateContext.emit('__barren__', (caller && typeof caller === 'function' && caller.bind(null, result)))

    // emit to all listeners of this action
    if(options.event) {
      updateContext.emit(action, result)
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
      inflightRequestCancellation: false, // assign request cancellation handler to the dispatcher
    }

    if (ACTION_STORE[action]) {

      assert(typeof ACTION_STORE[action] === 'function' , 'Action parameter `api` is not a function.')

      let request = ACTION_STORE[action]

      // execute the request if it is a promise
      if ((!equal(_cacheParams[action], params) || options.forceRewrite) && request instanceof Promise) {
        return request(params, options.inflightRequestCancellation).then(result => this.delegate(action, params, options, caller, result))
      } else if (!(request instanceof Promise)){
        const result = request.call(this, params)
        return this.delegate(action, params, options, caller, result)
      } else {
        caller && typeof caller === 'function' && caller.call(null, STORE[action])
        return STORE[action]
      }
    }
  }

  clearCache (action) {
    if (this._cacheParams[action] !== undefined) {
      this._cacheParams[action] = undefined
    }
  }

  clearAllCache (){
    Object.keys(this._cacheParams).forEach(action => {
      this._cacheParams[action] = undefined
    })
  }

  getStatus (action) {
    return (this.STORE[action] && this.STORE[action].success) || false
  }

  getData (action, param) {
    if(param && typeof this.STORE[action] === 'object'){
      return ((this.STORE[action] && this.STORE[action][param]) || null)
    } else {
      return this.STORE[action]
    }
  }

  overrideStore (action, value) {
    this.STORE[action] = { ...this.STORE[action], ...value }
  }

  forceEvent (event, params) {
    updateContext.emit(event, params)
  }
}

module.exports = function(actionStore, _store) {
  const store = new CreateStore(actionStore, _store)

  return {
    store,
    updateContext
  }
}
