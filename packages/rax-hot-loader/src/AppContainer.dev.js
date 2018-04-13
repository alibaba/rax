'use strict';

import { Component, createElement } from 'rax';
import deepForceUpdate from 'react-deep-force-update';
import Children from 'react-children';

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    if (typeof __RAX_HOT_LOADER__ === 'undefined') {
      console.error(
        'Rax Hot Loader: It appears that "rax-hot-loader/patch" ' +
          'did not run immediately before the app started. Make sure that it ' +
          'runs before any other code. For example, if you use Webpack, ' +
          'you can add "rax-hot-loader/patch" as the very first item to the ' +
          '"entry" array in its config. Alternatively, you can add ' +
          'require("rax-hot-loader/patch") as the very first line ' +
          'in the application code, before any other imports.'
      );
    }
  }

  componentWillReceiveProps() {
    // Hot reload is happening.
    // Retry rendering!
    this.setState({
      error: null
    });
    // Force-update the whole tree, including
    // components that refuse to update.
    deepForceUpdate(this);
  }

  // This hook is going to become official in React 15.x.
  // In 15.0, it only catches errors on initial mount.
  // Later it will work for updates as well:
  // https://github.com/facebook/react/pull/6020
  unstable_handleError(error) {
    // eslint-disable-line camelcase
    this.setState({
      error
    });
  }

  render() {
    const { error } = this.state;
    if (error) {
      console.log(error);
      return false;
    }

    return Children.only(this.props.children);
  }
}

AppContainer.propTypes = {
  children(props) {
    if (Children.count(props.children) !== 1) {
      return new Error(
        'Invalid prop "children" supplied to AppContainer. ' +
          'Expected a single React element with your app’s root component, e.g. <App />.'
      );
    }

    return undefined;
  }
};

module.exports = AppContainer;
