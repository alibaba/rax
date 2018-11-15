import {isWeex} from 'universal-env';

let currentState = 'active';
const eventHandlers = {
  change: new Map()
};

if (isWeex) {
  const globalEvent = __weex_require__('@weex-module/globalEvent');
  globalEvent.addEventListener('WXApplicationWillResignActiveEvent', () => {
    currentState = 'background';
    eventHandlers.change.forEach((handler) => {
      handler(currentState);
    });
  });
  globalEvent.addEventListener('WXApplicationDidBecomeActiveEvent', () => {
    currentState = 'active';
    eventHandlers.change.forEach((handler) => {
      handler(currentState);
    });
  });
}

const AppState = {
  get currentState() {
    return currentState;
  },
  isAvailable: isWeex,
  addEventListener: (type, handler) => {
    if (['change'].indexOf(type) === -1) {
      console.warn('Trying to subscribe to unknown event: "%s"', type);
      return;
    }
    if (isWeex) {
      eventHandlers[type].set(handler, handler);
    }
  },
  removeEventListener: (type, handler) => {
    if (['change'].indexOf(type) === -1) {
      console.warn('Trying to remove listener for unknown event: "%s"', type);
      return;
    }
    if (!eventHandlers[type].has(handler)) {
      return;
    }
    eventHandlers[type].set(handler, () => {});
  }
};

export default AppState;
