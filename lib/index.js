const React = require('react')
const { Component } = require('react')
const PropTypes = require('prop-types')

const store = (ComponentToWrap) => {
  return class StoreComponent extends Component {
    static get contextTypes () {
      return {
        store: PropTypes.object.isRequired,
        updateContext: PropTypes.object.isRequired
      }
    };
    render () {
      const { store, updateContext } = this.context
      const props = {
        ...this.props,
        store,
        updateContext
      }
      // certain implementation like create-react-app
      // does not allow compilation outside src, for
      // save measure we use React.createElement
      // instead of JSX syntax.
      return React.createElement(ComponentToWrap, props)
    }
  }
}

store.propTypes = {
  store: PropTypes.object.isRequired,
  updateContext: PropTypes.object.isRequired
}

module.exports = store
