/**
 * API implementation.
 */
export class WebAPI {
  /**
   * Check whether api is avaiable.
   * @param name {String} API name.
   */
  canIUse(name) {
    return Object.prototype.hasOwnProperty.call(this, name);
  }

  _registerAPI(method, fn) {
    this[method] = fn;
  }
}

export const my = new WebAPI();
