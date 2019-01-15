import { requestFrame } from './helpers';
import Pan from './Pan';
import Orientation from './Orientation';

export default class Event {
  constructor({ origin, type, callback }) {
    this.origin = origin;
    this.type = type;
    this.callback = callback;

    if (this.type) {
      requestFrame(this._listen.bind(this));
    }
  }

  _getElement() {
    if (!this.origin) {
      return null;
    }
    if (this.origin === '@window') {
      return window;
    } else if (this.origin === '@document') {
      return document;
    } else if (this.origin === '@body') {
      return document.body;
    } else {
      return document.querySelector(`#${this.origin}`);
    }
  }

  /**
   * 监听事件
   */
  _listen() {
    this.element = this._getElement();
    // auto start animation with no type or type is timing
    if (this.type === 'timing') {
      this.callback();
    } else if (this.type === 'pan') {
      this.pan = new Pan(this.element);
      this.pan.on('pan', this._onPan);
      this.pan.on('panstart', this._onPanStart);
      this.pan.on('panend', this._onPanEnd);
    } else if (this.type === 'orientation') {
      this.orientation = new Orientation(this.callback);
    } else {
      this.element && this.element.addEventListener(this.type, this.callback, false);
    }
  }

  /**
   * get node translateXY
   * @param {object} node element
   */
  getComputedTranslateXY = (node) => {
    const transformArray = [];
    if (!window.getComputedStyle) return transformArray;
    const style = getComputedStyle(node);
    const { transform } = style;

    let matrix = transform.match(/^matrix3d\((.+)\)$/);
    if (matrix) {
      const matrixs = matrix[1].split(', ');
      // 3d
      transformArray.push(parseFloat(matrixs[12]));
      transformArray.push(parseFloat(matrixs[13]));
      return transformArray;
    } else {
      // 2d
      matrix = transform.match(/^matrix\((.+)\)$/);
      if (matrix) {
        const matrixs = matrix[1].split(', ');
        transformArray.push(parseFloat(matrixs[4]));
        transformArray.push(parseFloat(matrixs[5]));
      }
      return transformArray;
    }
  }

  /**
   * get transform data
   * @param {boolean} start is start status
   * @return {object} transform data
   *   {number} startTranslateX touch start translateX
   *   {number} startTranslateY touch start translateY
   *   {number} translateX touch translateX
   *   {number} translateY touch translateY
   */
  getTransformData(start = false) {
    const transform = {};
    // event type is pan, add transform data
    const translate = this.getComputedTranslateXY(this.element);
    const translateX = translate[0] || 0;
    const translateY = translate[1] || 0;
    transform.translateX = translateX;
    transform.translateY = translateY;
    // start transform data
    if (start) {
      this.element.startTranslateX = translateX;
      this.element.startTranslateY = translateY;
    }
    transform.startTranslateX = this.element.startTranslateX;
    transform.startTranslateY = this.element.startTranslateY;

    return transform;
  }

  _onPan = (e) => {
    this.callback({
      x: e.deltaX,
      y: e.deltaY,
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      ...this.getTransformData()
    });
  }

  _onPanStart = (e) => {
    this.callback({
      x: 0,
      y: 0,
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      state: 'start',
      ...this.getTransformData(true)
    });
  }

  _onPanEnd = (e) => {
    this.callback({
      x: e.deltaX,
      y: e.deltaY,
      state: 'end',
      ...this.getTransformData()
    });
  }

  /**
   * 销毁事件
   */
  destroy() {
    if (this.type === 'pan') {
      if (this.pan) {
        this.pan.off('pan', this._onPan);
        this.pan.off('panstart', this._onPanStart);
        this.pan.off('panend', this._onPanEnd);
        this.pan.destroy();
      }
    } else if (this.type === 'orientation') {
      this.orientation && this.orientation.destroy();
    } else {
      this.element && this.element.removeEventListener(this.type, this.callback);
    }
  }
}