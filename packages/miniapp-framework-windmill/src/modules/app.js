import { global } from 'miniapp-framework-shared';
import { applyFactory } from '../utils';

const WORKER_INSTANCE = '__WINDMILL_INSTANCE__';
const APP_LIFECYCLE_MAP = {
  launch: 'app:launch',
  show: 'app:show',
  hide: 'app:hide'
};

/**
 * App module
 */
export default {
  on(evtName, callback) {
    const evevt = APP_LIFECYCLE_MAP[evtName] || evtName;
    const runtime = global[WORKER_INSTANCE];
    runtime.$cycle(evevt, callback);
  },
  off(evtName, callback) {
    const evevt = APP_LIFECYCLE_MAP[evtName] || evtName;
    const runtime = global[WORKER_INSTANCE];
    runtime.$decycle(evevt, callback);
  },
  register(appConfig, appFactory) {
    applyFactory(appFactory);
  },
};
