import { windmillReady } from '../windmill-store';
import { register } from 'core/worker/page';

const PAGE_LIFECYCLES = {
  load: 'page:load',
  ready: 'page:ready',
  show: 'page:show',
  hide: 'page:hide',
  unload: 'page:unload',
};

function normalizeEventName(evtName, clientId) {
  return `page@${clientId}:${evtName}`;
}

const cache = {};

/**
 * page module
 */
export default function createPageModule(clientId) {
  return (
    cache[clientId] ||
    (cache[clientId] = {
      on(evtName, callback) {
        if (PAGE_LIFECYCLES[evtName]) {
          const event = normalizeEventName(evtName, clientId);
          windmillReady(windmill => {
            windmill.$cycle(event, callback);
          });
        } else {
          windmillReady(windmill => {
            windmill.$on(evtName, function realCallback(data) {
              if (data && data.origin === clientId) {
                callback(data);
                callback.realCallback = realCallback;
              }
            });
          });
        }
      },
      off(evtName, callback) {
        if (PAGE_LIFECYCLES[evtName]) {
          const event = normalizeEventName(evtName, clientId);
          windmillReady(windmill => {
            windmill.$decycle(event, callback);
          });
        } else {
          windmillReady(windmill => {
            windmill.$off(
              evtName,
              callback && callback.realCallback
                ? callback.realCallback
                : callback
            );
          });
        }
      },
      register,
    })
  );
}

export const pageRegisterModule = { register };
