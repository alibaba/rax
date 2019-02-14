function noop() { }

class Console {
  constructor(options = {}) {
    this.send = options.sender || noop;
    this._enable = options.enable || false;
  }

  $enable() {
    this._enable = true;
    this.send('$switch', true);
  }

  $disable() {
    this._enable = false;
    this.send('$switch', false);
  }

  $toggle() {
    if (this._enable) {
      this.$disable();
    } else {
      this.$enable();
    }
  }

  /**
   * alias to info
   */
  log(...args) {
    if (!this._enable) {
      return;
    }
    return this.info.apply(this, args);
  }

  info(...args) {
    if (!this._enable) {
      return;
    }
    this.send('info', args);
  }

  debug(...args) {
    if (!this._enable) {
      return;
    }
    this.send('debug', args);
  }

  warn(...args) {
    if (!this._enable) {
      return;
    }
    this.send('warn', args);
  }

  error(...args) {
    if (!this._enable) {
      return;
    }
    this.send('error', args);
  }
}

export default Console;