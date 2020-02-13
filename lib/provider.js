const React = require('react')
const { Children } = require('react')
const PropTypes = require('prop-types')

class StoreProvider extends React.Component {
  constructor (props) {
    super(props)
    this.state = { n: null }
  }
  internalCycleUpdate (caller) {
    const n = Math.round(Math.random() * 1e17).toString(32)
    this.setState({ n }, () => {
      typeof caller === 'function' && caller()
    })
  }
  static get propTypes () {
    return {
      store: PropTypes.object.isRequired,
      updateContext: PropTypes.object.isRequired
    }
  };
  static get childContextTypes () {
    return {
      store: PropTypes.object.isRequired,
      updateContext: PropTypes.object.isRequired
    }
  };
  getChildContext () {
    const { store, updateContext } = this.props
    updateContext.on('__barren__', caller => this.internalCycleUpdate(caller))
    return { store, updateContext }
  }
  render () {
    return Children.only(this.props.children)
  }
}

module.exports = StoreProvider
