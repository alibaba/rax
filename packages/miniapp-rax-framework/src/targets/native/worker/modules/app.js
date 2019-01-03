import { windmillReady } from '../windmill-store';
import { applyFactory } from '../utils';

const APP_LIFECYCLE_MAP = {
  launch: 'app:launch',
  show: 'app:show',
  hide: 'app:hide'
};

/**
 * app module
 */
export default {
  on(evtName, callback) {
    const evevt = APP_LIFECYCLE_MAP[evtName] || evtName;
    windmillReady(windmill => {
      windmill.$cycle(evevt, callback);
    });
  },
  off(evtName, callback) {
    const evevt = APP_LIFECYCLE_MAP[evtName] || evtName;
    windmillReady(windmill => {
      windmill.$decycle(evevt, callback);
    });
  },
  register(appConfig, appFactory) {
    applyFactory(appFactory);
  }
};
