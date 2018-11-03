export default class Event {
  constructor(type, opts) {
    this.type = type;
    this.bubbles = !!opts.bubbles;
    this.cancelable = !!opts.cancelable;
  }
  stopPropagation() {
    this._stop = true;
  }
  stopImmediatePropagation() {
    this._end = this._stop = true;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}
