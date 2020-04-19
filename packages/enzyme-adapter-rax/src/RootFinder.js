const { createElement, Component } = require('rax');
const PropTypes = require('prop-types');

class RootFinder extends Component {
  render() {
    const { children } = this.props;
    return children;
  }
}
RootFinder.propTypes = {
  children: PropTypes.node,
};
RootFinder.defaultProps = {
  children: null,
};

module.exports = RootFinder;
