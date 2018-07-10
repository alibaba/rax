import { isNative } from './utils';
// next tick
const UA =
  typeof navigator === 'undefined' ? '' : navigator && navigator.userAgent;
const isWMLIOS =
  typeof __windmill_environment__ !== 'undefined' &&
  __windmill_environment__.platform === 'iOS'; /* eslint-disable-line */
const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || isWMLIOS;

const callbacks = [];
let pending = false;

let timerFunc = () => {
  setTimeout(flushCallbacks, 0);
};

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) {
      setTimeout(() => { });
    }
  };
}

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

export default function nextTick(cb, ctx) {
  let _resolve;

  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        console.error(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  }

  if (!cb) {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}
