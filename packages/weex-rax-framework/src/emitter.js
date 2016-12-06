export default class EventEmitter {
  constructor() {
    this._listeners = {};
  }

  /**
   * Adds a listener function to the specified event.
   * @param {String} type
   * @param {Function} listener
   * @param {Boolean} once
   */
  _addListener(type, listener, once) {
    this._listeners[type] = this._listeners[type] || [];
    this._listeners[type].push({listener, once});
    return this;
  }

  /**
   * Adds a listener function to the specified event.
   * @param {String} type
   * @param {Function} listener
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  on(type, listener) {
    return this._addListener(type, listener, false);
  }

  once(type, listener) {
    return this._addListener(type, listener, true);
  }

  /**
   * Removes a listener function to the specified event.
   * @param {String} type
   * @param {Function} listener
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  off(type, listener) { // alias
    if (!this._listeners[type]) {
      return this;
    }
    if (!this._listeners[type].length) {
      return this;
    }
    if (!listener) {
      delete this._listeners[type];
      return this;
    }
    this._listeners[type] = this._listeners[type].filter(
      _listener => !(_listener.listener === listener)
    );
    return this;
  }

  /**
   * Emits an specified event.
   * @param {String} type
   * @param {Object} payload
   * @return {Object} Current instance of EventEmitter for chaining.
   */
  emit(type, payload) {
    if (!this._listeners[type]) {
      return this;
    }
    this._listeners[type].forEach(_listener => {
      _listener.listener.apply(this, [payload]);
      if (_listener.once) {
        this.removeListener(type, _listener.listener);
      }
    });
    return this;
  }
}
