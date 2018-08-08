import {isWeex} from 'universal-env';

const EVENTS = ['mousedown', 'mousewheel', 'touchmove', 'keydown'];

export default {
  register: (cancelEvent) => {
    if (isWeex || typeof document === 'undefined') {
      return;
    }

    for (var i = 0; i < EVENTS.length; i = i + 1) {
      document.addEventListener(EVENTS[i], cancelEvent);
    }
  }
};
