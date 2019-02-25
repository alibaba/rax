import { worker, global } from 'miniapp-framework-shared';

const WORKER_INSTANCE = '__WINDMILL_INSTANCE__';
const PAGE_LIFECYCLES = {
  load: 'page:load',
  ready: 'page:ready',
  show: 'page:show',
  hide: 'page:hide',
  unload: 'page:unload',
};

const cache = {};
export const registerPage = worker.pageHub.register;

export function createPage(clientId) {
  return (
    cache[clientId] ||
    (cache[clientId] = {
      on(evtName, callback) {
        const runtime = global[WORKER_INSTANCE];
        if (PAGE_LIFECYCLES[evtName]) {
          const event = normalizeEventName(evtName, clientId);
          runtime.$cycle(event, callback);
        } else {
          runtime.$on(evtName, function realCallback(data) {
            if (data && data.origin === clientId) {
              callback(data);
              callback.realCallback = realCallback;
            }
          });
        }
      },
      off(evtName, callback) {
        const runtime = global[WORKER_INSTANCE];
        if (PAGE_LIFECYCLES[evtName]) {
          const event = normalizeEventName(evtName, clientId);
          runtime.$decycle(event, callback);
        } else {
          runtime.$off(
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

function normalizeEventName(evtName, clientId) {
  return `page@${clientId}:${evtName}`;
}
