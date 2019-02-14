import createDriverWorker from 'driver-worker';
import { worker, debug, log } from 'miniapp-framework-shared';
import global from './global';
import polyfillES from 'miniapp-framework-shared/src/polyfill';
import setupWorker from './setupWorker';
import { createRax, applyFactory } from './utils';

const { getPage, getUnknownPageFactory } = worker.pageHub;
const { on: clientOn, emit: emitToClient } = worker.clientHub;

/**
 * Polyfill AppWorker Env.
 */
polyfillES(global);

let appWorker;

/**
 * AppWorker entry.
 */
try {
  appWorker = setupWorker();
  debug('Worker Successfully setup!');
} catch (err) {
  log('Error: Setup worker with error.');
  throw err;
}

/**
 * Create a page instance when renderer is ready.
 * If some client is ready, mark clientReadyState's key to clientId, value to true.
 *
 * clientReadyState: {
 *   [clientId]: undefined/true
 * }
 *
 * pendingMessages: {
 *   [clientId]: undefined/[function]
 * }
 */
const clientReadyEvent = 'r$';
const clientReadyState = {};
const pendingMessages = {};
function handleClientReady(event) {
  const { origin: clientId } = event;
  if (!clientReadyState[clientId]) {
    clientReadyState[clientId] = true;
    if (Array.isArray(pendingMessages[clientId])) {
      let fn;
      while (fn = pendingMessages[clientId].shift()) {
        fn();
      }
    }
  }
}
appWorker.$on(clientReadyEvent, handleClientReady);

const EVENT_BEFORE_PAGE_CREATE = 'beforePageCreate';
const EVENT_RENDER_TO_WORKER = 'r2w';
const EVENT_WORKER_TO_RENDER = 'w2r';
appWorker.$on(EVENT_BEFORE_PAGE_CREATE, handleBeforePageCreate);
appWorker.$on(EVENT_RENDER_TO_WORKER, handleRenderToWorker);
function handleBeforePageCreate(event) {
  const { data, origin: clientId } = event;
  const { pageName } = data;

  debug('Start render page in worker, clientId: %s, pageName: %s', clientId, pageName);

  // todo with native: add pageQuery to data.
  const rax = createRax();

  function postMessage (message) {
    const payload = { data: message };
    if (clientReadyState[clientId]) {
      appWorker.$emit(EVENT_WORKER_TO_RENDER, payload, clientId);
    } else {
      pendingMessages[clientId] = pendingMessages[clientId] || [];
      pendingMessages[clientId].push(
        appWorker.$emit.bind(appWorker, EVENT_WORKER_TO_RENDER, payload, clientId)
      );
    }
  }
  function addEventListener(eventName, callback) {
    clientOn(clientId, eventName, callback);
  }
  const driver = createDriverWorker({ postMessage, addEventListener });
  const { document, evaluator } = driver;
  const { factory } = getPage(pageName, rax);
  const PageComponent = applyFactory(factory, {
    clientId,
    pageName,
    raxInstance: rax,
    pageQuery: {},
    document,
    evaluator,
  });
  rax.render(rax.createElement(PageComponent), null, {
    driver,
  });
}
function handleRenderToWorker(event) {
  const { data, origin: clientId } = event;

  emitToClient(clientId, 'message', data);
}

/**
 * Handle renderer ready event.
 * @param event
 */
// function onRendererReady(event) {
//   let { origin: clientId } = event;
//   if (process.env.NODE_ENV !== 'production') {
//     debug(`renderer ready ${JSON.stringify(event)}`);
//   }
//   let { pageName, pageQuery } = event.data;
//   clientId = decodeURIComponent(clientId);
//   pageName = decodeURIComponent(pageName);
//
//   if (!clientId) {
//     error(`can not get clientId ${clientId}`);
//   }
//
//   const raxInstance = createRax();
//   const { createElement, render } = raxInstance;
//   const { factory } = getPage(pageName, raxInstance);
//
//   const driver = createDriver({
//     postMessage(message) {
//       appWorker.$emit('w2r', { data: message }, clientId);
//     },
//     addEventListener(evtName, callback) {
//       clientOn(clientId, evtName, callback);
//     },
//   });
//   const { document, evaluator } = driver;
//
//   let component;
//   try {
//     component = applyFactory(factory, {
//       clientId,
//       pageName,
//       raxInstance,
//       pageQuery,
//       document,
//       evaluator,
//     });
//   } catch (err) {
//     component = applyFactory(
//       getUnknownPageFactory(raxInstance, {
//         message: `${err.message}`,
//       })
//     );
//   }
//
//   addClient(clientId, {
//     createElement,
//     render,
//     component,
//     driver,
//   });
//
//   if (process.env.NODE_ENV !== 'production') {
//     debug('Emit renderer-init');
//   }
//
//   /**
//    * Tell worker to render dom.
//    */
//   appWorker.$emit('r#', { clientId }, clientId);
// }

export { appWorker };
export function getAppWorker() {
  return appWorker;
}
