import getModule from './getModule';
import { my } from './api';

const globalObject = {
  my,
  require: getModule,
};

/**
 * Setup global object.
 * @param root {Object} Root object.
 */
export function setupGlobalObject(root = global) {
  for (let key in globalObject) {
    if (globalObject.hasOwnProperty(key)) {
      root[key] = globalObject[key];
    }
  }
}
