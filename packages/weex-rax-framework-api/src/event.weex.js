
module.exports = function() {
  class Event {
    constructor(type, params = {}) {
      this.type = type;
      this.bubbles = Boolean(params.bubbles);
      this.cancelable = Boolean(params.cancelable);
    }
  }

  class CustomEvent extends Event {
    constructor(type, params = {}) {
      super(type, params);
      this.detail = params.detail;
    }
  }

  return {
    Event,
    CustomEvent
  };
};
