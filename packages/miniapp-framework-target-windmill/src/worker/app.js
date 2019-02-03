import { appWorker } from '../../../mp-runtime/lib';
import { applyFactory } from './utils';

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
    appWorker.$cycle(evevt, callback);
  },
  off(evtName, callback) {
    const evevt = APP_LIFECYCLE_MAP[evtName] || evtName;
    appWorker.$decycle(evevt, callback);
  },
  register(appConfig, appFactory) {
    applyFactory(appFactory);
  },
};
