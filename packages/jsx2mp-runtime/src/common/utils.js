/**
 * Bridge setState directly to setData. `this` is bound to component instance.
 * @param particialState {Object|Function}
 * @param callback? {Function}
 */
export function setState(particialState, callback) {
  return this.setData(particialState, callback);
}
/**
 * Bridge to forceUpdate.
 * @param callback? {Function}
 */
export function forceUpdate(callback) {
  return setState.call(this, {}, callback);
}
/**
 * be used to determine whether an object has the specified property as a direct property of that object
 * @param object {Object|Function}
 * @param prop? {Function}
 * @return {Boolean}
 */
export function hasOwn(object, prop) {
  return Object.hasOwnProperty.call(object, prop);
}


