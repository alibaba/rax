import Registry, { config, getOffset, pushElement } from './appearRegistry';

const appear = () => {
  let instances = [];

  Registry.createEvent();
  eventListenerHook(instances);

  instance = new Registry({
    container: window
  });
  instances.push(instance);

  let control = {
    config: (opts) => {
      config(opts);
    }
  };

  return control;
};

let instance = null;

// hijack addEventListener、removeEventListener
let eventListenerHook = (instances) => {
  let nativeAddEventListener = Node.prototype.addEventListener;
  let nativeRemoveEventListener = Node.prototype.removeEventListener;

  Node.prototype.addEventListener = function(eventName, eventHandler, useCapture, isNotWatch) {
    let lowerCaseEventName = eventName.toLowerCase();
    if (lowerCaseEventName === 'appear' || lowerCaseEventName === 'disappear') {
      pushElement(this);
    }

    if (instance) {
      instance.check();
    }

    if (lowerCaseEventName === 'scroll' && !isNotWatch) {
      instance = new Registry({
        container: this
      });
      instances.push(instance);
    }
    nativeAddEventListener.call(this, eventName, eventHandler, useCapture);
  };

  Node.prototype.removeEventListener = function(eventName, eventHandler, useCapture, isNotWatch) {
    let lowerCaseEventName = eventName.toLowerCase();

    // destroy scroller
    if (lowerCaseEventName === 'scroll' && !isNotWatch) {
      instances.forEach((instance, index) => {
        if (instance.__handle && instance.container === this) {
          this.removeEventListener('scroll', instance.__handle, false, true);
          instance.__handle = null;
          instance.appearWatchElements = [];
          instance.container = null;
          instances.splice(index, 1);
        }
      });
    }
    nativeRemoveEventListener.call(this, eventName, eventHandler, useCapture);
  };
};

export default appear();
