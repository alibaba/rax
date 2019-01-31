export default class Event {
  constructor(type, options = {}) {
    this.type = type.toLowerCase();
    this.bubbles = !!options.bubbles;
    this.cancelable = !!options.cancelable;
    this.defaultPrevented = false;
  }
  stopPropagation() {
    this.bubbles = false;
  }
  stopImmediatePropagation() {
    this.bubbles = false;
    this._end = true;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}
