'use strict';

export default class Euler {

  static RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];

  static DefaultOrder = 'XYZ';

  isEuler = true;

  _x = 0;
  _y = 0;
  _z = 0;

  constructor(x, y, z, order) {
    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._order = order || Euler.DefaultOrder;
  }

  get order() {
    return this._order;
  }

  set order(value) {
    this._order = value;
    this.onChangeCallback();
  }

  set(x, y, z, order) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order || this._order;
    this.onChangeCallback();
    return this;
  }

  onChange(callback) {
    this.onChangeCallback = callback;
    return this;
  }

  onChangeCallback() {
  }


}

