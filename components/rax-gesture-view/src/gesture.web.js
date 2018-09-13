/** @jsx createElement */

'use strict';

import {createElement, Component} from 'rax';
import View from 'rax-view';

const threshold = 5;

const touchActionRatio = 1 / 1;

class GestureViewOnWeb extends Component {
  startX = undefined;

  startY = undefined;

  isStartX = false;

  isStartY = false;

  maxDy = 0;

  maxDx = 0;

  panType;

  onTouchStart = (e) => {
    this.startX = e.changedTouches[0].clientX;
    this.startY = e.changedTouches[0].clientY;
  }

  reset() {
    this.startX = undefined;
    this.startY = undefined;
    this.maxDy = 0;
    this.maxDx = 0;
    this.isStartX = false;
    this.isStartY = false;
    this.panType = undefined;
    this.isPropagationStoppedX = false;
    this.isPropagationStoppedY = false;
  }

  onTouchMove = (e) => {
    let {onHorizontalPan, onVerticalPan} = this.props;
    let deltaX = e.changedTouches[0].clientX - this.startX;
    let deltaY = e.changedTouches[0].clientY - this.startY;

    this.maxDx = Math.max(Math.abs(deltaX), this.maxDx);
    this.maxDy = Math.max(Math.abs(deltaY), this.maxDy);

    if (this.isPropagationStoppedX || this.isPropagationStoppedY) {
      e.stopPropagation();
    }

    // horizontal pan
    if (onHorizontalPan && Math.abs(deltaX) >= threshold && Math.abs(deltaY / deltaX) < touchActionRatio && Math.abs(this.maxDy) < threshold) {
      e.preventDefault();
      this.isPropagationStoppedX = true;
      this.panType = 'x';
      if (!this.isStartX) {
        e.state = 'start';
        e.changedTouches[0].deltaX = deltaX;
        this.isStartX = true;
      } else {
        e.state = 'move';
        e.changedTouches[0].deltaX = deltaX;
      }
      onHorizontalPan && onHorizontalPan(e);
    } else if (onVerticalPan && Math.abs(deltaY) >= threshold && Math.abs(deltaX / deltaY) < touchActionRatio && Math.abs(this.maxDx) < threshold) {
      e.preventDefault();
      this.isPropagationStoppedY = true;
      this.panType = 'y';
      if (!this.isStartY) {
        e.state = 'start';
        e.changedTouches[0].deltaY = deltaY;
        this.isStartY = true;
      } else {
        e.state = 'pan';
        e.changedTouches[0].deltaY = deltaY;
      }
      onVerticalPan && onVerticalPan(e);
    }
  }

  onTouchEnd = (e) => {
    let {onHorizontalPan, onVerticalPan} = this.props;
    e.state = 'end';
    e.changedTouches[0].deltaX = e.changedTouches[0].clientX - this.startX;
    e.changedTouches[0].deltaY = e.changedTouches[0].clientY - this.startY;
    if (this.panType == 'x') {
      onHorizontalPan && onHorizontalPan(e);
    } else if (this.panType == 'y') {
      onVerticalPan && onVerticalPan(e);
    }
    this.reset();
  }

  onTouchCancel = (e) => {
    let {onHorizontalPan, onVerticalPan} = this.props;
    e.state = 'cancel';
    e.changedTouches[0].deltaX = e.changedTouches[0].clientX - this.startX;
    e.changedTouches[0].deltaY = e.changedTouches[0].clientY - this.startY;
    if (this.panType == 'x') {
      onHorizontalPan && onHorizontalPan(e);
    } else if (this.panType == 'y') {
      onVerticalPan && onVerticalPan(e);
    }
    this.reset();
  }

  render() {
    return (<View {...this.props}
      onTouchStart={this.onTouchStart}
      onTouchMove={this.onTouchMove}
      onTouchEnd={this.onTouchEnd}
      onTouchCancel={this.onTouchCancel}
    />);
  }
}

export default GestureViewOnWeb;