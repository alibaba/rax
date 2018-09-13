/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';

class GestureViewOnWeex extends Component {
  onTouchStart = (e) => {
    this.startX = e.changedTouches[0].clientX;
  }

  onHorizontalPan = (e) => {
    let {onHorizontalPan} = this.props;
    e.changedTouches[0].deltaX = e.changedTouches[0].clientX - this.startX;
    onHorizontalPan && onHorizontalPan(e);
  }

  render() {
    return <View {...this.props} onTouchStart={this.onTouchStart} onHorizontalPan={this.onHorizontalPan} />;
  }
}

export default GestureViewOnWeex;
