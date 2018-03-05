/* eslint-disable react/prop-types */

'use strict';

import { createElement, Component } from 'rax';
import Children from 'react-children';

class AppContainer extends Component {
  render() {
    if (this.props.component) {
      return <this.props.component {...this.props.props} />;
    }

    return Children.only(this.props.children);
  }
}

module.exports = AppContainer;
