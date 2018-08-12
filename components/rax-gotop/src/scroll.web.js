import easing from './easing';
import cancelEvents from './cancel-events';
import events from './scroll-events';

const scrollEasing = easing.scroll;
let __currentPositionY = 0;
let __startPositionY = 0;
let __targetPositionY = 0;
let __progress = 0;
let __duration = 0;
let __cancel = false;

let __target;
let __to;
let __start;
let __deltaTop;
let __percent;
let __delayTimeout;

/*
 * Function helper
 */
const functionWrapper = (value) => {
  return typeof value === 'function' ? value : () => {
    return value;
  };
};

/*
 * Sets the cancel trigger
 */

cancelEvents.register(() => {
  __cancel = true;
});

/*
 * Wraps window properties to allow server side rendering
 */
const currentWindowProperties = () => {
  if (typeof window !== 'undefined') {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  }
};

/*
 * Helper function to never extend 60fps on the webpage.
 */
const requestAnimationFrameHelper = (() => {
  return currentWindowProperties() ||
    function(callback, element, delay) {
      window.setTimeout(callback, delay || 1000 / 60, new Date().getTime());
    };
})();

const currentPositionY = () => {
  let supportPageOffset = window.pageXOffset !== undefined;
  let isCSS1Compat = (document.compatMode || '') === 'CSS1Compat';
  return supportPageOffset ? window.pageYOffset : isCSS1Compat ?
    document.documentElement.scrollTop : document.body.scrollTop;
};

const pageHeight = () => {
  let body = document.body;
  let html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
};

const animateTopScroll = (timestamp) => {
  // Cancel on specific events
  if (__cancel) {
    return;
  }

  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  if (__start === null) {
    __start = timestamp;
  }

  __progress = timestamp - __start;

  __percent = __progress >= __duration ? 1 : scrollEasing(__progress / __duration);

  __currentPositionY = __startPositionY + Math.ceil(__deltaTop * __percent);

  window.scrollTo(0, __currentPositionY);

  if (__percent < 1) {
    requestAnimationFrameHelper.call(window, animateTopScroll);
    return;
  }

  if (events.registered.end) {
    events.registered.end(__to, __target, __currentPositionY);
  }
};

const startAnimateTopScroll = (y, options, to, target) => {
  window.clearTimeout(__delayTimeout);

  __start = null;
  __cancel = false;
  __startPositionY = currentPositionY();
  __targetPositionY = options.absolute ? y : y + __startPositionY;
  __deltaTop = Math.round(__targetPositionY - __startPositionY);

  __duration = functionWrapper(options.duration)(__deltaTop);
  __duration = isNaN(parseFloat(__duration)) ? 1000 : parseFloat(__duration);
  __to = to;
  __target = target;

  if (options && options.delay > 0) {
    __delayTimeout = window.setTimeout(function animate() {
      requestAnimationFrameHelper.call(window, animateTopScroll);
    }, options.delay);
    return;
  }

  requestAnimationFrameHelper.call(window, animateTopScroll);
};

const scrollToTop = (options) => {
  startAnimateTopScroll(0, Object.assign(options || {}, { absolute: true }));
};

const scrollTo = (toY, options) => {
  startAnimateTopScroll(toY, Object.assign(options || {}, { absolute: true }));
};

const scrollToBottom = (options) => {
  startAnimateTopScroll(pageHeight(), Object.assign(options || {}, { absolute: true }));
};

const scrollMore = (toY, options) => {
  startAnimateTopScroll(currentPositionY() + toY, Object.assign(options || {}, { absolute: true }));
};

export default {
  animateTopScroll: startAnimateTopScroll,
  scrollToTop: scrollToTop,
  scrollToBottom: scrollToBottom,
  scrollTo: scrollTo,
  scrollMore: scrollMore,
};
