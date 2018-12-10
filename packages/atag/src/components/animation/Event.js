import { requestFrame } from './shared/helpers';
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

  _onPan = (e) => {
    this.callback({
      x: e.deltaX,
      y: e.deltaY,
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    });
  }

  _onPanStart = (e) => {
    this.callback({
      x: 0,
      y: 0,
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      state: 'start'
    });
  }

  _onPanEnd = (e) => {
    this.callback({
      x: e.deltaX,
      y: e.deltaY,
      state: 'end'
    });
  }

  /**
   * 销毁事件
   */
  destroy() {
    if (this.type === 'pan') {
      this.pan.off('pan', this._onPan);
      this.pan.off('panstart', this._onPanStart);
      this.pan.off('panend', this._onPanEnd);
      this.pan.destroy();
    } else if (this.type === 'orientation') {
      this.orientation.destroy();
    } else {
      this.element.removeEventListener(this.type, this.callback);
    }
  }
}