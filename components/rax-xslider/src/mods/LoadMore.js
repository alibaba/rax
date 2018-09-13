/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';

class LoadMore extends Component {
  static defaultProps = {
    onLoading: null
  }

  handleLoading() {
    if (typeof this.props.onLoading === 'function') {
      this.props.onLoading();
    }
  }

  render() {
    let {itemCount, cardSize, vertical} = this.props;

    return (<View style={[vertical ? {
      position: 'absolute',
      top: itemCount * cardSize,
      left: 0,
      right: 0,
    } : {
      position: 'absolute',
      left: itemCount * cardSize,
      top: 0,
      bottom: 0,
    }, {...this.props.style}]}>{this.props.children}</View>);
  }
}

export default LoadMore;