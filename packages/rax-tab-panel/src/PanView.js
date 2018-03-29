/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';
import {isWeex} from 'universal-env';

const threshold = 5;

class PanViewOnWeb extends Component {

  startX = undefined;

  startY = undefined;

  isStartX = false;

  isStartY = false;

  onTouchStart = () => {}

  reset() {
    this.startX = undefined;
    this.startY = undefined;
    this.isStartX = false;
    this.isStartY = false;
  }

  onTouchMove = (e) => {
    e.stopPropagation();
    let {onHorizontalPan} = this.props;
    if (this.startX === undefined) {
      this.startX = e.changedTouches[0].clientX;
    }
    let deltaX = e.changedTouches[0].clientX - this.startX;
    if (Math.abs(deltaX) >= threshold) {
      if (!this.isStartX) {
        e.state = 'start';
        e.changedTouches[0].deltaX = deltaX;
        this.isStartX = true;
      } else {
        e.state = 'pan';
        e.changedTouches[0].deltaX = deltaX;
      }
      onHorizontalPan && onHorizontalPan(e);
    }
  }

  onTouchEnd = (e) => {
    let {onHorizontalPan} = this.props;
    e.state = 'end';
    e.changedTouches[0].deltaX = e.changedTouches[0].clientX - this.startX;
    onHorizontalPan && onHorizontalPan(e);
    this.reset();
  }

  onTouchCancel = (e) => {
    let {onHorizontalPan} = this.props;
    e.state = 'cancel';
    e.changedTouches[0].deltaX = e.changedTouches[0].clientX - this.startX;
    onHorizontalPan && onHorizontalPan(e);
    this.reset();
  }

  render() {
    return (<View {...this.props}
      onTouchStart={this.onTouchStart}
      onTouchMove={this.onTouchMove}
      onTouchEnd={this.onTouchEnd}
      onTouchCancel={this.onTouchCancel} />);
  }


}

class PanViewOnWeex extends Component {

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


class PanView extends Component {
  render() {
    return isWeex ? <PanViewOnWeex {...this.props} /> : <PanViewOnWeb {...this.props} />;
  }
}

export default PanView;