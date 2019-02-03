import { log, error } from '../../../miniapp-framework/src/debugger';
import { getAppWorker } from '.';
import app from './app';
import { registerPage, createPage } from './page';

const MODULE_GETTER = '__WINDMILL_MODULE_GETTER__';
const getNativeModule = global[MODULE_GETTER];

/**
 * Get schema data.
 * @param {Function} successCallback
 * @param {Function} errorCallback
 */
function getSchemaData(successCallback, errorCallback) {
  getAppWorker().$call('memoryStorage.getItem', {
    key: 'schemaData'
  }, successCallback, errorCallback);
}

const VALID_MOD_REG = /^@core\//;

/**
 * Get module by name.
 * @param mod {String} Module name.
 */
export default function getModule(mod) {
  log(`requiring mod ${mod}`);
  if (!VALID_MOD_REG.test(mod)) {
    error('Unknown module, only core modules allowed!' + mod);
    return null;
  }
  const context = this;

  switch (mod) {
    case '@core/app':
      return app;

    case '@core/page':
      if (context && context.clientId) {
        return createPage(context.clientId);
      } else {
        return { register: registerPage };
      }

    case '@core/rax':
      return context && context.raxInstance;

    /**
     * For template app to get schema data
     */
    case '@core/getSchemaData':
      return getSchemaData;
  }
}
