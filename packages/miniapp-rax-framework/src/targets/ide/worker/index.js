/* global importScripts */
import Client from './Client';
import { warn } from '../../../core/debugger';
import { emit as emitToClient, addClient, getClient } from '../../../core/worker/clientHub';
import { emit as emitAppLifecycle } from './app';
import { setupGlobalObject } from './globalObject';
import navigator from './navigator';

const CURRENT_CLIENT_ID = '__current_client_id__';

/**
 * Inject some global object to WorkerScope
 */
setupGlobalObject();

addEventListener('message', ({ data }) => {
  const { target, payload } = data;

  if (target !== 'AppWorker') {
    console.error('AppWorker get illegal data', data);
    return;
  }

  if (payload.type === 'importScripts') {
    // Todo: support of plugins.
    importScripts(payload.url);
    // Tell AppContainer that worker is ready.
    postMessage({
      target: 'AppContainer',
      payload: { type: 'r$' },
    });
  } else if (payload.type === 'init') {
    /**
     * DOM Render will trigger init, which means start render a page.
     */
    const { clientId, pageName, pageQuery } = payload;
    const client = new Client(clientId, pageName, pageQuery);
    client.render();

    addClient(clientId, client);
    emitToClient(payload.clientId, 'message', { data: payload });
  } else if (payload.type === 'event' || payload.type === 'return') {
    /**
     * Evaluator message type.
     */
    emitToClient(payload.clientId, 'message', { data: payload });
  } else if (payload.type === 'app:lifecycle') {
    emitAppLifecycle(payload.lifecycle, {});
  } else if (payload.type === 'page:lifecycle') {
    const { clientId, lifecycle } = payload;
    const client = getClient(clientId);
    client.emitEvent(lifecycle, clientId, {});

    // Mark current client id.
    if (lifecycle === 'show') {
      global[CURRENT_CLIENT_ID] = clientId;
    }
  } else if (payload.type === 'navigate') {
    const { navigateType, navigateTo } = payload;
    navigator._navigate(navigateType, navigateTo);
  } else if (payload.type === 'updatePageData') {
    const client = getClient(payload.clientId);
    client.emitEvent('updatePageData', payload.data);
  } else {
    warn('Can not recognize message', data);
  }
});
