import createDriverWorker from 'driver-worker';
import { worker, global, debug, log } from 'miniapp-framework-shared';
import polyfillES from 'miniapp-framework-shared/src/polyfill';
import setupRuntime from './runtime';
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
  appWorker = setupRuntime();
  debug('Worker Successfully setup!');
} catch (err) {
  log('Error: Setup worker with error.');
  throw err;
}

/**
 * Render timing control.
 */
const EVENT_BEFORE_PAGE_CREATE = 'beforePageCreate';
const EVENT_PRERENDER_READY = 'renderReady';
const EVENT_CLIENT_READY = 'r$';
const EVENT_COMPATIBLE_WORKER_READY = 'r#';
const EVENT_RENDER_TO_WORKER = 'r2w';
const EVENT_WORKER_TO_RENDER = 'w2r';
/**
 * Mark client is ready to revice message.
 * @type {{clientId: Boolean}}
 */
const clientReadyState = {};
/**
 * Store pending messages
 * @type {{clientId: [Function]}}
 */
const pendingMessages = {};

appWorker.$on(EVENT_CLIENT_READY, handleClientReady);
appWorker.$on(EVENT_PRERENDER_READY, handleClientReady);
appWorker.$on(EVENT_BEFORE_PAGE_CREATE, handleBeforePageCreate);
appWorker.$on(EVENT_RENDER_TO_WORKER, handleRenderToWorker);

/**
 * Time to send message, if message is ready before moment,
 * messages are pending to send here.
 */
function handleClientReady(event) {
  const { origin: clientId, data = {} } = event;

  /**
   * @Note: Compatible to old render timing procedure,
   * must emit a r# event to make DOM listeners start working.
   */
  appWorker.$emit(EVENT_COMPATIBLE_WORKER_READY, { clientId }, clientId);

  if (!clientReadyState[clientId]) {
    clientReadyState[clientId] = true;
    if (Array.isArray(pendingMessages[clientId])) {
      let fn;
      while (fn = pendingMessages[clientId].shift()) fn();
    }
  } else {
    // In case of renderer page refresh
    const { pageQuery, pageName } = data;
    renderPage(pageName, clientId, pageQuery);
  }
}

/**
 * Trigger render page at the same time of
 * client(webview) start init.
 */
function handleBeforePageCreate(event) {
  const { data = {}, origin: clientId } = event;
  const { pageName, pageQuery } = data;
  renderPage(pageName, clientId, pageQuery);
}

/**
 * Receive message from render to worker.
 */
function handleRenderToWorker(event) {
  const { data, origin: clientId } = event;
  emitToClient(clientId, 'message', data);
}

/**
 * Start worker rendering.
 * @param pageName {String}
 * @param clientId {String}
 * @param pageQuery {Object|null}
 */
function renderPage(pageName, clientId, pageQuery = {}) {
  debug('Start render page in worker, clientId: %s, pageName: %s', clientId, pageName);
  const rax = createRax();

  // Make sure messages are arrived in order.
  let order = 0;
  function postMessage(message) {
    const payload = { data: message, order: order++ };
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

  let PageComponent;
  // Try to instansition page.
  try {
    PageComponent = applyFactory(factory, {
      clientId,
      pageName,
      raxInstance: rax,
      pageQuery,
      document,
      evaluator,
    });
  } catch (err) {
    /**
     * In case of user code throw errors,
     * or page is not defined.
     */
    PageComponent = applyFactory(
      getUnknownPageFactory(
        rax,
        { message: `${err.message}` }
      )
    );
  }

  rax.render(rax.createElement(PageComponent), null, {
    driver,
  });
}

export { appWorker };
export function getAppWorker() {
  return appWorker;
}
