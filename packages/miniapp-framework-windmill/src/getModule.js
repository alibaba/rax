import { global, log, debug } from 'miniapp-framework-shared';
import appLifecycle from './modules/app';
import { registerPage, createPage } from './modules/page';

const WORKER_INSTANCE = '__WINDMILL_INSTANCE__';
const VALID_MOD_REG = /^@core\//;

/**
 * Get schema data.
 * @param {Function} successCallback
 * @param {Function} errorCallback
 */
function getSchemaData(successCallback, errorCallback) {
  const runtime = global[WORKER_INSTANCE];
  if (runtime) runtime.$call('memoryStorage.getItem', {
    key: 'schemaData'
  }, successCallback, errorCallback);
}

/**
 * Get module by name.
 * @param mod {String} Module name.
 */
export default function getModule(mod) {
  log(`requiring mod ${mod}`);
  if (!VALID_MOD_REG.test(mod)) {
    debug('Unknown module, only core modules allowed!' + mod);
    return null;
  }
  const context = this;

  switch (mod) {
    case '@core/app':
      return appLifecycle;

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
