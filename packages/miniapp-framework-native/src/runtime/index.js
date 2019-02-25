import { debug, global } from 'miniapp-framework-shared';
import * as AppRuntimeGlobal from './app';
import * as PluginRuntimeGlobal from './plugin';

const REGISTER_DSL = '__REGISTER_DSL_FRAMEWORK_IN_WORKER__';
const WORKER_INSTANCE = '__WINDMILL_INSTANCE__';
const registerDSL = global[REGISTER_DSL];

/**
 * Setup AppWorker.
 */
export default function setupRuntime() {
  debug('Setup MiniApp Framework Worker Runtime.');

  /*
   * Setup Windmill Runtime.
   */
  const appWorker = registerDSL({
    name: 'miniapp',
    getContext() {
      return AppRuntimeGlobal;
    },
    getPluginContext(context) {
      const MODULE_API = '__WINDMILL_MODULE_API__';
      const moduleAPI = global[MODULE_API];
      return {
        ...PluginRuntimeGlobal,
        // Pass context to get plugined api expose.
        ...moduleAPI.getAPIs({ context }),
      };
    },
  });

  global[WORKER_INSTANCE] = appWorker;
  return appWorker;
}
