import polyfill from '../../../core/polyfill';
import createDriver from 'driver-worker';
import { error, debug } from '../../../core/debugger';
import { getPage, getUnknownPageFactory } from '../../../core/worker/page';
import { setWindmill } from './windmill-store';
import resolvePathname from 'resolve-pathname';
import apiPreprocessors from './modules/apiPreprocessors';
import { createRax, applyFactory } from './utils';
import {
  addClient,
  getClient,
  on as clientOn,
  emit as emitToClient,
} from '../../../core/worker/clientHub';
import getContextObject from './utils/getContextObject';
import * as globalObjects from './global';
import contextRequire from './require';

const ctx = getContextObject();
polyfill(ctx);
ctx.global = ctx;
const registerDSL = ctx.__REGISTER_DSL_FRAMEWORK_IN_WORKER__;
let apiCache = null;

export default function setupWorker() {
  if (process.env.NODE_ENV !== 'production') {
    debug(
      `Setup MiniApp framework in worker. Version: ${VERSION} BuiltAt ${BUILD_TIME}` // eslint-disable-line
    );
  }
  if (!apiCache) {
    const moduleApi = ctx.__WINDMILL_MODULE_API__;
    if (!moduleApi) {
      error('Can not load windmill-moudle-api from global context.');
    } else {
      ctx.apiCache = apiCache = moduleApi.getAPIs({
        preprocessor: apiPreprocessors
      });
    }
  }
  const windmill = registerDSL({
    name: 'miniapp',
    getContext() {
      return {
        ...globalObjects,
        require: contextRequire,
        /* polyfills */
        polyfill,
        wmlEnv: ctx.__windmill_environment__,
        /* my api injection */
        ...apiCache,
      };
    },
  });
  setWindmill(windmill);

  /**
   * r$ means
   *   renderer-ready
   * create a page instance
   * when renderer created
   */
  windmill.$on('r$', function(event) {
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

    const rax = createRax();
    const { createElement, render } = rax;
    const { factory } = getPage(pageName, rax);

    const driver = createDriver({
      postMessage(message) {
        /**
         * w2r means
         *   worker2renderer
         */
        windmill.$emit('w2r', { data: message }, clientId);
      },
      addEventListener(evtName, callback) {
        clientOn(clientId, evtName, callback);
      },
    });

    let component;
    try {
      const { document, evaluator } = driver;
      component = applyFactory(factory, {
        clientId,
        pageName,
        rax,
        pageQuery,
        document,
        evaluator,
      });
    } catch (err) {
      component = applyFactory(
        getUnknownPageFactory(rax, {
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
      debug('emit renderer-init');
    }

    // renderer-init
    windmill.$emit(
      'r#',
      {
        clientId,
      },
      clientId
    );
  });

  /**
   * listening renderer message
   */
  windmill.$on('r2w', event => {
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
   * listening navigator event
   */
  windmill.$on('navigate', event => {
    const { data, origin: clientId } = event;
    const { payload } = data || {};

    function normalizeNavigatorDestnation(currentPath, target) {
      const isURL = /^([\w\d]+:)?\/\//.test(target);
      if (isURL) {
        // external url
        return target;
      }

      if (target[0] === '.') {
        // relative path
        target = resolvePathname(
          payload.navigateTo,
          decodeURIComponent(data.pageName)
        );
        return target[0] === '/' ? target.slice(1) : target;
      } else if (target[0] === '/') {
        // absolute path
        return target.slice(1);
      } else {
        // full page name
        return target;
      }
    }

    switch (payload.navigateType) {
      case 'redirect':
        windmill.$call('navigator.pop', { animated: false });
      case 'navigate': {
        const target = normalizeNavigatorDestnation(
          decodeURIComponent(data.pageName),
          payload.navigateTo
        );

        windmill.$call('navigator.push', {
          url: target,
        });
        break;
      }

      case 'switchTab': {
        const target = normalizeNavigatorDestnation(
          decodeURIComponent(data.pageName),
          payload.navigateTo
        );
        windmill.$call('navigator.switchTab', {
          url: target,
          animated: false,
        });
        break;
      }

      case 'navigateBack':
        windmill.$call('navigator.pop', {});
        break;
    }
  });
}

try {
  // ENTRY
  setupWorker();
  debug('worker setupped!');
} catch (err) {
  error(`setup worker error ${err.message} ${err.stack}`);
}
