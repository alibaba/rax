/**
 * get orientation data
 * {object} data orientation data
 * {number} lon 水平坐标
 * {number} lat 垂直坐标
 * {number} offsetLon 相对上次的水平坐标位移
 * {number} offsetLat 相对上次的垂直坐标位移
 * {number} deltaX 左右倾斜偏移量
 * {number} deltaY 前后倾斜偏移量
 */
export default class Orientation {
  lon = 0;
  lat = 0;
  direction = 0;
  fix = 0;
  os = '';

  constructor(callback) {
    this._handleDeviceOrientation = this._handleDeviceOrientation.bind(this);
    this._handleOrientationChange = this._handleOrientationChange.bind(this);

    this.onOrient = callback;
    this.data = {
      initLeftRotate: undefined,
      initForwardSlant: 0,
      lon: undefined,
      lat: undefined,
      orientation: window.orientation || 0
    };
    // get os
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    window.addEventListener('deviceorientation', this._handleDeviceOrientation, false);
    // 横竖屏变化
    window.addEventListener('orientationchange', this._handleOrientationChange, false);
  }

  _handleOrientationChange() {
    this.data.orientation = window.orientation;
  }

  _handleDeviceOrientation(event) {
    let alpha = event.alpha;
    let beta = event.beta;
    let gamma = event.gamma;

    // https://github.com/w3c/deviceorientation/issues/6
    if (this.data.initLeftRotate === undefined) {
      this.data.initLeftRotate = this.data.isIOS ? event.webkitCompassHeading : alpha;
    }
    // iOS 的 alpha 的已经是相对的了，不做处理
    if (!this.data.isIOS) {
      if (alpha > 0 || alpha < this.data.initLeftRotate) {
        alpha += 360;
      }
      alpha -= this.data.initLeftRotate;
    }

    this.data.leftRotate = alpha < 180 ? alpha : alpha - 360;
    this.data.rightRotate = -this.data.leftRotate;

    switch (this.data.orientation) {
      case 0:
        this.data.forwardSlant = beta;
        break;
      case 90:
        this.data.forwardSlant = gamma < 0 ? -gamma : 180 - gamma;
        break;
      case -90:
        this.data.forwardSlant = gamma < 0 ? 180 + gamma : gamma;
        break;
    }
    this.data.deltaY = -this.data.forwardSlant;
    this.data.isForward = this.data.forwardSlant > 0;
    this.data.isBackward = !this.data.isForward;

    if (this.data.initForwardSlant === undefined) {
      this.data.initForwardSlant = this.data.forwardSlant; // 记录初始的 向前倾斜度
    }
    switch (this.data.orientation) {
      case 0:
        this.data.forwardThreshold = this.data.initForwardSlant > 0 ? -180 + this.data.initForwardSlant : 180 + this.data.initForwardSlant;
        if (this.data.initForwardSlant > 0 && beta < this.data.forwardThreshold) {
          this.data.relativeForwardSlant = beta + 360 - this.data.initForwardSlant;
        } else if (this.data.initForwardSlant < 0 && beta > this.data.forwardThreshold) {
          this.data.relativeForwardSlant = beta - 180 - this.data.initForwardSlant;
        } else {
          this.data.relativeForwardSlant = beta - this.data.initForwardSlant;
        }
        break;
      case 90:
      case -90:
        // this.data.forwardThreshold
        // 横屏时，只考虑向前倾斜度在 [0, 180] 的情况
        this.data.relativeForwardSlant = this.data.forwardSlant - this.data.initForwardSlant;
        break;
    }
    this.data.relativeBackwardSlant = -this.data.relativeForwardSlant;
    this.data.isRelativeForward = this.data.relativeForwardSlant > 0;
    this.data.isRelativeBackward = !this.data.isRelativeForward;

    // 计算 左右倾斜度
    switch (this.data.orientation) {
      case 0:
        this.data.leftSlant = -gamma;
        break;
      case 90:
        this.data.leftSlant = -beta;
        break;
      case -90:
        this.data.leftSlant = beta;
        break;
    }
    this.data.deltaX = -this.data.leftSlant;
    this.data.isLeft = this.data.leftSlant > 0;
    this.data.isRight = !this.data.isLeft;

    // 计算经纬度
    let lon = this.data.leftRotate + this.data.deltaX;
    lon = lon < 0 ? lon + 360 : lon;
    let lat = this.data.forwardSlant - 90;

    this.data.offsetLon = this.data.lon === undefined ? 0 : lon - this.data.lon;
    this.data.offsetLat = this.data.lat === undefined ? 0 : lat - this.data.lat;
    this.data.lon = lon;
    this.data.lat = lat;

    if (this.onOrient) this.onOrient(this.data);
  }

  destroy() {
    window.removeEventListener('deviceorientation', this._handleDeviceOrientation, false);
    window.removeEventListener('orientationchange', this._handleOrientationChange, false);
  }
}