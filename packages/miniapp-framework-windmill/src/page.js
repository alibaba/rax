import { appWorker } from './index';
import { worker } from 'miniapp-framework-shared';

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
export const registerPage = worker.pageHub.register;

export function createPage(clientId) {
  return (
    cache[clientId] ||
    (cache[clientId] = {
      on(evtName, callback) {
        if (PAGE_LIFECYCLES[evtName]) {
          const event = normalizeEventName(evtName, clientId);
          appWorker.$cycle(event, callback);
        } else {
          appWorker.$on(evtName, function realCallback(data) {
            if (data && data.origin === clientId) {
              callback(data);
              callback.realCallback = realCallback;
            }
          });
        }
      },
      off(evtName, callback) {
        if (PAGE_LIFECYCLES[evtName]) {
          const event = normalizeEventName(evtName, clientId);
          appWorker.$decycle(event, callback);
        } else {
          appWorker.$off(
            evtName,
            callback && callback.realCallback
              ? callback.realCallback
              : callback
          );
        }
      },
      register: registerPage,
    })
  );
}

