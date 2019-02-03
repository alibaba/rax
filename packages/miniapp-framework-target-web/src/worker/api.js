/**
 * my api
 */
import { call } from './remoteCall';

const hasOwn = {}.hasOwnProperty;

export class WebAPI {
  /**
   * Check whether api is avaiable.
   * @param name {String} API name.
   */
  canIUse(name) {
    return hasOwn.call(this, name);
  }

  _registerAPI(method, fn) {
    this[method] = fn;
  }
}

export const my = new WebAPI();
