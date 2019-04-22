const WORKER_SYSTEM_INFO = '__miniapp_env__';
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

  getSystemInfo(params = {}) {
    if (typeof params.success === 'function') {
      params.success.call(this, my.getSystemInfoSync());
    }
    if (typeof params.complete === 'function') {
      params.complete.call(this, my.getSystemInfoSync());
    }
  },

  /**
   * Get system info.
   * @return {{sync: boolean}}
   */
  getSystemInfoSync() {
    return global[WORKER_SYSTEM_INFO];
  },

  _registerAPI(method, fn) {
    my[method] = fn;
  },
};

export default my;
