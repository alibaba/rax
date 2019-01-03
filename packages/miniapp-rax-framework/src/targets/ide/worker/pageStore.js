import createDriver from 'driver-worker';
import { log } from '../../../core/debugger';
import { addMessageListener } from './pageListeners';
import workerRequire from './getModule';
import { createElement } from 'rax';

const pages = {};

export function registerPage(pageId, pageName, factory) {
  if (pages[pageId]) {
    return;
  }

  const module = { exports: {} };
  factory(module, module.exports, workerRequire);

  const instance = module.exports.default || module.exports;
  if (!instance && process.env.NODE_ENV !== 'production') {
    throw new Error('can not load page ' + pageId);
  }

  pages[pageId] = {
    pageName,
    Page: instance,
    el: createElement(instance, {}),
    driver: createDriver({
      postMessage(message) {
        message.$$pageId = pageId;
        postMessage(message);
      },
      addEventListener(evtName, callback) {
        // evtName only will be message
        if (evtName === 'message') {
          addMessageListener(pageId, callback);
        } else {
          log(`can not add ${evtName} handler`);
        }
      }
    })
  };
}

export function getPage(pageId) {
  if (pages[pageId]) {
    return pages[pageId];
  } else {
    return null;
  }
}
