import Registry, { config, getOffset, pushElement } from './appearRegistry';
import createIntersectionObserver, { observerElement, isExistIntersection } from './intersectionObserver';

let instance = null;
const existIntersection = isExistIntersection();

const appear = () => {
  if (existIntersection) {
    createIntersectionObserver();
    injectEventListenerHook();
  } else {
    let instances = [];

    Registry.createEvent();
    injectEventListenerHook(instances);

    instance = new Registry({
      container: window
    });
    instances.push(instance);

    let control = {
      config,
    };

    return control;
  }
};


// hijack addEventListener、removeEventListener
const injectEventListenerHook = (instances = []) => {
  let nativeAddEventListener = Node.prototype.addEventListener;
  let nativeRemoveEventListener = Node.prototype.removeEventListener;

  Node.prototype.addEventListener = function(eventName, eventHandler, useCapture, doNotWatch) {
    const lowerCaseEventName = eventName && String(eventName).toLowerCase();
    const isAppearEvent = lowerCaseEventName === 'appear' || lowerCaseEventName === 'disappear';
    if (isAppearEvent) {
      if (existIntersection) {
        observerElement(this);
      } else {
        pushElement(this);
      }
    }

    if (!existIntersection) {
      if (instance && isAppearEvent) {
        instance.check([this]);
      }

      if (lowerCaseEventName === 'scroll' && !doNotWatch) {
        instance = new Registry({
          container: this
        });
        instances.push(instance);
      }
    }

    nativeAddEventListener.call(this, eventName, eventHandler, useCapture);
  };

  Node.prototype.removeEventListener = function(eventName, eventHandler, useCapture, doNotWatch) {
    let lowerCaseEventName = eventName && String(eventName).toLowerCase(); ;

    // destroy scroller
    if (!existIntersection && lowerCaseEventName === 'scroll' && !doNotWatch) {
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
