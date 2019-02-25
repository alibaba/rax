import { polyfill as polyfillArrayES6 } from 'runtime-shared/src/array.es6';
import { polyfill as polyfillArrayES7 } from 'runtime-shared/src/array.es7';
import { polyfill as polyfillNumber } from 'runtime-shared/src/number.es6';
import { polyfill as polyfillObjectES6 } from 'runtime-shared/src/object.es6';
import { polyfill as polyfillObjectES8 } from 'runtime-shared/src/object.es8';
import { polyfill as polyfillStringES6 } from 'runtime-shared/src/string.es6';
import { polyfill as polyfillStringES7 } from 'runtime-shared/src/string.es7';
import PolyfilledPromise from 'runtime-shared/src/promise';
import PolyfilledSetImmediate from './setImmediate';
import * as PolyfilledNativeTimer from './NativeTimer';

const TIMER_FN = {
  setTimeout: 'setNativeTimeout',
  setInterval: 'setNativeInterval',
  clearTimeout: 'clearNativeTimeout',
  clearInterval: 'clearNativeInterval',
};

/**
 * Polyfill es6 baseline
 * @param {Object} global
 */
export default function polyfillES(global) {
  const { Array, Number, Object, String, isNaN } = global;

  // android native timer polyfill
  const timerFnList = Object.keys(TIMER_FN);
  for (let i = 0, len = timerFnList.length; i < len; i++) {
    if (
      !global[timerFnList[i]] &&
      typeof global[TIMER_FN[timerFnList[i]]] === 'function'
    ) {
      global[timerFnList[i]] = PolyfilledNativeTimer[timerFnList[i]];
    }
  }

  // compatible with old android JSC, which having no setTimeout
  if (!global.setTimeout) {
    global.setTimeout = (fn, delay, ...args) => fn(...args);
  }

  polyfillArrayES6(Array);
  polyfillArrayES7(Array);
  polyfillNumber(Number);
  polyfillObjectES6(Object);
  polyfillObjectES8(Object);
  polyfillStringES6(String);
  polyfillStringES7(String);

  const NativePromise = global.Promise;
  const nativePromiseSupported =
    NativePromise &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    'resolve' in NativePromise &&
    'reject' in NativePromise &&
    'all' in NativePromise &&
    'race' in NativePromise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new NativePromise(function(r) {
        resolve = r;
      });
      return typeof resolve === 'function';
    })();

  if (!nativePromiseSupported || isIOS8()) {
    // iOS8 JSC buggy Promise
    global.Promise = PolyfilledPromise;
  }

  if (!global.setImmediate) {
    global.setImmediate = PolyfilledSetImmediate;
  }
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = function(fn) {
      return global.setTimeout(fn, 16);
    };
  }
}

function isIOS8() {
  try {
    eval('class A {}');
  } catch (err) {
    return true;
  }
  return false;
}
