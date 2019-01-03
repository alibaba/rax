/**
 * App level life cycle and register.
 */
import { applyFactory } from './utils';

const events = {
  launch: [],
  show: [],
  hide: []
};

export function emit(cycleName, payload) {
  if (!events[cycleName]) {
    return;
  }

  for (let i = 0, l = events[cycleName].length; i < l; i++) {
    events[cycleName][i](payload);
  }
}

export function on(cycleName, callback) {
  if (events[cycleName]) {
    events[cycleName].push(callback);
  }
}

export function off(cycleName, callback) {
  if (events[cycleName]) {
    const idx = events[cycleName].indexOf(callback);
    if (idx !== -1) {
      events[cycleName].splice(idx, 1);
    }
  }
}

/**
 * Run app factory immediately.
 * @param descriptor
 * @param factory
 */
export function register(descriptor, factory) {
  applyFactory(factory);
}
