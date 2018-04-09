'use strict';
import Vector3 from '../vector3';
import DeviceOrientationControls from '../orientation_controls';
import _Math from '../math';
import {raf, cancelRAF} from '../raf';
import CommonHandler from './common';
import assign from 'object-assign';

export default class OrientationHandler extends CommonHandler {

  binding = null;

  control = null;

  start = null;

  timer = null;

  constructor(binding) {
    super(binding);
    this.options = assign({
      sceneType: '2d'
    }, binding.options.options);
    this.binding = binding;
    if (this.options.sceneType.toLowerCase() === '2d') {
      this.controlX = new DeviceOrientationControls({beta: 90});
      this.controlY = new DeviceOrientationControls({gamma: 90, alpha: 0});
    } else {
      this.control = new DeviceOrientationControls();
    }
    this.run();
  }

  run() {
    // 2d场景
    if (this.options.sceneType.toLowerCase() === '2d') {
      this.controlX.update();
      this.controlY.update();
      let {alpha, beta, gamma, dalpha, dbeta, dgamma} = this.controlX.deviceOrientation;
      var vecX = new Vector3(0, 0, 1);
      vecX.applyQuaternion(this.controlX.quaternion);
      var vecY = new Vector3(0, 1, 1);
      vecY.applyQuaternion(this.controlY.quaternion);
      // 0,180 -> -90,90
      var x = _Math.radToDeg(Math.acos(vecX.x)) - 90;
      var y = _Math.radToDeg(Math.acos(vecY.y)) - 90;
      if (!this.start && !isNaN(x) && !isNaN(y)) {
        this.start = {
          x,
          y
        };
      }
      if (this.start) {
        let dx = x - this.start.x;
        let dy = y - this.start.y;
        this._onOrientation({
          x, y, dx, dy, alpha, beta, gamma, dalpha, dbeta, dgamma
        });
      }
    } else {
      // 3d场景
      this.control.update();
      let {alpha, beta, gamma, dalpha, dbeta, dgamma} = this.control.deviceOrientation;
      let {x, y, z} = this.control.quaternion;
      this._onOrientation({alpha, beta, gamma, dalpha, dbeta, dgamma, x, y, z});
    }
    this.timer = raf(() => {
      this.run();
    });
  }

  _onOrientation = (e) => {
    let {props} = this.binding.options;
    props.forEach((prop) => {
      let {element, property, expression} = prop;
      let transformed = JSON.parse(expression.transformed);
      let val = this.binding.getValue(e, transformed);
      this.binding.setProperty(element, property, val);
    });
  }

  destroy() {
    if (this.timer) {
      cancelRAF(this.timer);
      this.timer = null;
    }
  }

}