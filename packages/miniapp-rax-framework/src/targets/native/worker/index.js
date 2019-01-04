import createDriver from 'driver-worker';
import polyfill from '../../../core/polyfill';
import { error, debug } from '../../../core/debugger';
import { getPage, getUnknownPageFactory } from '../../../core/worker/pageHub';
import { createRax, applyFactory } from './utils.js';
import {
  addClient,
  getClient,
  on as clientOn,
  emit as emitToClient,
} from '../../../core/worker/clientHub';
import setupWorker from './setupWorker';

/**
 * Polyfill AppWorker Env.
 */
polyfill(global);

let appWorker;

/**
 * AppWorker entry.
 */
try {
  appWorker = setupWorker();
  debug('Worker Successfully setup!');
} catch (err) {
  error('Setup worker with error.');
  throw err;
}

/**
 * Create a page instance when renderer is ready.
 */
appWorker.$on('r$', onRendererReady);

/**
 * Receive message from renderer.
 */
appWorker.$on('r2w', event => {
  const { data, origin: clientId } = event;

  emitToClient(clientId, 'message', data);

  if (data.data.type === 'init') {
    const { render, createElement, component, driver } = getClient(
      clientId
    );
    debug(`start render fn, clientId: ${clientId}`);

    render(createElement(component, {}), null, {
      driver,
    });
  }
});

/**
 * Handle renderer ready event.
 * @param event
 */
function onRendererReady(event){
  let { origin: clientId } = event;
  if (process.env.NODE_ENV !== 'production') {
    debug(`renderer ready ${JSON.stringify(event)}`);
  }
  let { pageName, pageQuery } = event.data;
  clientId = decodeURIComponent(clientId);
  pageName = decodeURIComponent(pageName);

  if (!clientId) {
    error(`can not get clientId ${clientId}`);
  }

  const raxInstance = createRax();
  const { createElement, render } = raxInstance;
  const { factory } = getPage(pageName, raxInstance);

  const driver = createDriver({
    postMessage(message) {
      appWorker.$emit('w2r', { data: message }, clientId);
    },
    addEventListener(evtName, callback) {
      clientOn(clientId, evtName, callback);
    },
  });
  const { document, evaluator } = driver;

  let component;
  try {
    component = applyFactory(factory, {
      clientId,
      pageName,
      raxInstance,
      pageQuery,
      document,
      evaluator,
    });
  } catch (err) {
    component = applyFactory(
      getUnknownPageFactory(raxInstance, {
        message: `${err.message}`,
      })
    );
  }

  addClient(clientId, {
    createElement,
    render,
    component,
    driver,
  });

  if (process.env.NODE_ENV !== 'production') {
    debug('Emit renderer-init');
  }

  /**
   * Tell worker to render dom.
   */
  appWorker.$emit('r#', { clientId }, clientId);
}

export { appWorker };
export function getAppWorker() {
  return appWorker;
}
