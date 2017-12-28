'use strict';

import PanGesture from '../pan';
import CommonHandler from './common';

export default class PanHandler extends CommonHandler {

  constructor(binding) {
    super(binding);
    let {anchor} = binding.options;
    let panGesture = this.panGesture = new PanGesture(anchor, binding.options.options);
    panGesture.on('pan', this._onPan);
    panGesture.on('panstart', this._onPanStart);
    panGesture.on('panend', this._onPanEnd);
  }

  _onPan = (e) => {
    let x = e.deltaX;
    let y = e.deltaY;
    let {props = []} = this.binding.options;
    props.forEach((prop) => {
      let {element, property, expression} = prop;
      let transformed = JSON.parse(expression.transformed);
      let val = this.binding.getValue({x, y}, transformed);
      this.binding.setProperty(element, property, val);
    });
  }

  _onPanStart = () => {
    this.binding.callback({deltaX: 0, state: 'start', deltaY: 0});
  }

  _onPanEnd = (e) => {
    this.binding.callback({deltaX: parseInt(e.deltaX), state: 'end', deltaY: parseInt(e.deltaY)});
  }

  destroy() {
    let panGesture = this.panGesture;
    panGesture.off('pan', this._onPan);
    panGesture.off('panstart', this._onPanStart);
    panGesture.off('panend', this._onPanEnd);
    panGesture.destroy();
  }


};