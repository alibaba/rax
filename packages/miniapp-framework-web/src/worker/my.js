const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * my API implementation.
 */
const my = {
  /**
   * Check whether api is avaiable.
   * @param name {String} API name.
   */
  canIUse(name) {
    return hasOwnProperty.call(my, name);
  },

  _registerAPI(method, fn) {
    my[method] = fn;
  },
};

export default my;
