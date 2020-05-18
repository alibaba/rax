class Events {
  constructor() {
    this._callbacks = {};
  }

  on(event, handler) {
    (this._callbacks[event] || (this._callbacks[event] = [])).push(handler);
    return this;
  }

  off(event, handler) {
    // Flush all
    if (!arguments) {
      this._callbacks = Object.create(null);
    }
    // specific event
    const eventCallbacks = this._callbacks[event];
    if (!eventCallbacks) {
      return this;
    }
    if (!handler) {
      this._callbacks[event] = null;
      return this;
    }
    // specific handler
    let callback;
    let i = eventCallbacks.length;
    while (i--) {
      callback = eventCallbacks[i];
      if (callback === handler) {
        eventCallbacks.splice(i, 1);
        break;
      }
    }
    return this;
  }

  emit(event) {
    const callbacks = this._callbacks[event];
    if (callbacks) {
      const args = [].slice.call(arguments, 1);
      callbacks.forEach(callback => callback.apply(this, args));
    }
    return this;
  }
}

export default Events;
