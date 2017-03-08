import {isWeex} from 'universal-env';
let events = ['mousedown', 'mousewheel', 'touchmove', 'keydown'];

export default {
  register: (cancelEvent) => {
    if (isWeex || typeof document === 'undefined') {
      return;
    }

    for (var i = 0; i < events.length; i = i + 1) {
      document.addEventListener(events[i], cancelEvent);
    }
  }
};
