const { assert } = require('./utils.js')

class UpdateContext {
  constructor () {
    this.ctx = {}
  }
  /**
   * Returns a reference to the eventName reg, so the chained function is called
   * @param {string} reg - the identifier eventName
   * @param {function} fn - the function to chained
   */
  on (reg, fn) {
    assert(typeof fn === 'function', 'Second argument is not a function.')
    this.ctx[reg] = fn
  }
  /**
   * Synchronously calls a listener registered for the event named reg
   * @param {string} reg - the event name
   * @param {...*} value - one or more parameters to emit to listener
   */
  emit (reg, ...args) {
    typeof this.ctx[reg] === 'function' && this.ctx[reg].apply(null, args)
  }
}

module.exports = UpdateContext