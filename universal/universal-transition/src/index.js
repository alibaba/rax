import {isWeex, isWeb} from 'universal-env';
import {convertUnit} from 'style-unit';

export default function transition(node, styles, options, callback) {
  if (!node) return;

  if (typeof options == 'function' || options == null) {
    callback = options;
    options = {
      timingFunction: 'ease',
      duration: 0,
      delay: 0,
    };
  }

  for (let prop in styles) {
    styles[prop] = convertUnit(styles[prop], prop);
  }

  if (isWeex) {
    const animation = __weex_require__('@weex-module/animation');
    animation.transition(node.ref, {
      styles,
      timingFunction: options.timingFunction || 'linear',
      delay: options.delay || 0,
      duration: options.duration || 0,
      needLayout: options.needLayout || false
    }, callback || function() {});
  } else if (isWeb) {
    const properties = Object.keys(styles);
    const duration = options.duration || 0; // ms
    const timingFunction = options.timingFunction || 'linear';
    const delay = options.delay || 0; // ms
    const transitionValue = properties.length ?
      properties.map((property) => `${property} ${duration}ms ${timingFunction} ${delay}ms`).join(',') :
      `all ${duration}ms ${timingFunction} ${delay}ms`;

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
