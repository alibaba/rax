/* global importScripts, frameworkType */
import { log, worker } from 'miniapp-framework-shared';
import my from './my';
import { call } from './remoteCall';
import * as appLifecycle from './lifecycles/app';
import Client from './Client';
import getModule from './getModule';

setupGlobalObject({
  my,
  require: getModule,
  /**
   * @Note: Internal varibale to judge IDE/Web env.
   */
  __framework_type__: frameworkType,
});
addEventListener('message', messageHandler);

const { emit: emitToClient, addClient, getClient } = worker.clientHub;
const CURRENT_CLIENT_ID = '__current_client_id__';
const MINIAPP_ENV = '__miniapp_env__';
const EVENT_IMPORT_SCRIPTS = 'importScripts';
const EVENT_REGISTER_API = 'registerAPI';
const EVENT_START_RENDER = 'init';
const EVENT_EVALUATOR_EVENT = 'event';
const EVENT_EVALUATOR_RETURN = 'return';
const EVENT_CYCLE_APP = 'app:lifecycle';
const EVENT_CYCLE_PAGE = 'page:lifecycle';
const EVENT_NAVIGATOR = 'navigate';
const EVENT_UPDATE_PAGEDATA = 'updatePageData';
const EVENT_SET_ENV = 'setEnv';

/**
 * Worker message handler.
 * @param data
 */
function messageHandler({ data }) {
  const { target, payload } = data;
  if (target !== 'AppWorker') return;

  switch (payload.type) {
    case EVENT_IMPORT_SCRIPTS: {
      importScripts(payload.url);
      break;
    }

    case EVENT_SET_ENV: {
      setupGlobalObject({
        [MINIAPP_ENV]: payload.env,
      });
      break;
    }

    case EVENT_REGISTER_API: {
      Array.isArray(payload.apis) && payload.apis.forEach(method => {
        my._registerAPI(method, (params = {}) => {
          const { success, fail, complete, ...methodParams } = params;
          return call(`my.${method}`, methodParams, success, fail);
        });
      });
      // Tell AppContainer that worker is ready.
      postMessage({
        target: 'AppContainer',
        payload: { type: 'r$' },
      });
      break;
    }

    case EVENT_START_RENDER: {
      /**
       * DOM Render will trigger init, which means start render a page.
       */
      const { clientId, pageName, pageQuery } = payload;
      const client = new Client(clientId, pageName, pageQuery);
      client.render();

      addClient(clientId, client);
      emitToClient(payload.clientId, 'message', { data: payload });
      break;
    }

    case EVENT_EVALUATOR_EVENT:
    case EVENT_EVALUATOR_RETURN:
      /**
       * Evaluator message type.
       */
      emitToClient(payload.clientId, 'message', { data: payload });
      break;

    case EVENT_CYCLE_APP: {
      appLifecycle.emit(payload.lifecycle, {});
      break;
    }

    case EVENT_CYCLE_PAGE: {
      const { clientId, lifecycle } = payload;
      const client = getClient(clientId);
      client.emitEvent(lifecycle, clientId, {});

      // Mark current client id.
      if (lifecycle === 'show') global[CURRENT_CLIENT_ID] = clientId;
      break;
    }

    case EVENT_NAVIGATOR: {
      let { navigateType, navigateTo } = payload;
      /**
       * @Note: if navigateType is `navigate`, which means
       * it is navigateTo, others are the right types.
       */
      if (!navigateType || navigateType === 'navigate') navigateType = 'navigateTo';
      my[navigateType]({ url: navigateTo });
      break;
    }

    case EVENT_UPDATE_PAGEDATA: {
      const client = getClient(payload.clientId);
      client.emitEvent('updatePageData', payload.data);
      break;
    }

    default:
      log('Can not recognize message', data);
  }
}

/**
 * Setup global object.
 * @param object {Object} Assigning object.
 * @param root {Object} Root object.
 */
function setupGlobalObject(object, root = global) {
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      root[key] = object[key];
    }
  }
}
