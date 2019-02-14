import { debug } from 'miniapp-framework-shared/src/debugger';
import * as AppRuntimeGlobal from './AppRuntime/global';
import * as PluginRuntimeGlobal from './PluginRuntime/global';

const REGISTER_DSL = '__REGISTER_DSL_FRAMEWORK_IN_WORKER__';
const registerDSL = global[REGISTER_DSL];

/**
 * Setup AppWorker
 */
export default function setupWorker() {
  if (process.env.NODE_ENV !== 'production') {
    debug('Setup MiniApp framework in worker.');
  }

  /*
   * Setup Windmill Runtime.
   */
  const appWorker = registerDSL({
    name: 'miniapp',
    getContext() {
      return AppRuntimeGlobal;
    },
    getPluginContext() {
      return PluginRuntimeGlobal;
    },
  });

  return appWorker;
}
