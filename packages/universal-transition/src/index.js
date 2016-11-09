import {isWeex, isWeb} from 'universal-env';

export default function transition(node, styles, options, callback) {
  if (typeof options == 'function' || options == null) {
    callback = options;
    options = {
      timingFunction: 'ease',
      duration: 0,
      delay: 0,
    };
  }

  if (isWeex) {
    const animation = require('@weex-module/animation');
    animation.transition(node.ref, {
      styles,
      timingFunction: options.timingFunction,
      delay: options.delay,
      duration: options.duration,
    }, callback || function() {});
  } else if (isWeb) {
    const duration = options.duration; // ms
    const timingFunction = options.timingFunction;
    const delay = options.delay;  // ms
    const transitionValue = 'all ' + duration + 'ms '
        + timingFunction + ' ' + delay + 'ms';

    node.style.transition = transitionValue;
    node.style.webkitTransition = transitionValue;

    if (callback) {
      const transitionEndHandler = function(e) {
        e.stopPropagation();
        node.removeEventListener('webkitTransitionEnd', transitionEndHandler);
        node.removeEventListener('transitionend', transitionEndHandler);
        node.style.transition = '';
        node.style.webkitTransition = '';
        callback();
      };
      node.addEventListener('webkitTransitionEnd', transitionEndHandler);
      node.addEventListener('transitionend', transitionEndHandler);
    }

    for (const key in styles) {
      // TODO add vendor prefix
      let value = styles[key];
      node.style[key] = value;
    }
  }
}
