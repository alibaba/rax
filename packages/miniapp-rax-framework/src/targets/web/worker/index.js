import { getPage, getUnknownPageFactory } from '../../../core/worker/pageHub';
import { log, warn } from '../../../core/debugger';
import { createRax, applyFactory } from './utils';
import require from './getModule';
import createDriver from 'driver-worker';
import {
  on as clientOn,
  emit as emitToClient
} from '../../../core/worker/clientHub';
import { $emit as $emitAppLifecycle } from './lifecycle';
import { $emit as $emitPageLifecycle } from './modules/page';
import { my } from './api';
import { call } from './remoteCall';
import { setupGlobalObject } from './globalObject';

setupGlobalObject(global);

function registerPages() {
  const url = global.location.origin + '/build/app.js';
  return fetch(url)
    .then(res => res.text())
    .then(code => {
      // inject global context
      const fn = new Function('require', 'my', code);
      try {
        fn(require, self.api);
      } catch (err) {
        log('执行 app.js bundle 错误!');
        err.url = url;
        throw err;
      }

      // app launch 事件
      $emitAppLifecycle('launch', {});
      // 第一次页面展示
      $emitAppLifecycle('show');
    })
    .then(() => {
      for (
        let i = 0, l = registerPages.callbacks.length;
        i < l;
        i++
      ) {
        registerPages.callbacks[i]();
      }
      registerPages.ready = true;
      return true;
    });
}

addEventListener('message', ({ data }) => {
  const { type, pageName, clientId } = data || {};
  switch (type) {
    case 'importScripts':
      importScripts(data.url); // eslint-disable-line
      if (data.urlType === 'app') {
        postMessage({ type: 'AppRegistered' });
      }
      break;

    case 'registerAPI':
      data.apis.forEach(method => {
        my._registerAPI(method, (params = {}, successCallback, failCallback) => {
          const { success, fail, complete, ...methodParams } = params;
          const callKey = `my.${method}`;
          return call(callKey, methodParams, successCallback, failCallback);
        });
      });
      postMessage({ type: 'APIRegistered' });
      break;

    case 'init':
      // 初始化
      // domRender() 会触发一个 init,
      // 但是页面加载是异步的, 等待对应页面加载
      ready(() => {
        const rax = createRax();
        const { createElement, render } = rax;
        const { factory } = getPage(pageName, rax);

        const driver = createDriver({
          postMessage(message) {
            /**
             * w2r means
             *   worker2renderer
             */
            postMessage({
              type: 'w2r',
              pageName,
              clientId,
              data: message,
            });
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
            pageQuery: data.pageQuery,
            document,
            evaluator,
          });
        } catch (err) {
          console.error(err);
          component = applyFactory(
            getUnknownPageFactory(rax, {
              message: '加载出现了错误',
            })
          );
        }
        emitToClient(clientId, 'message', { data });
        // 页面加载时触发
        $emitPageLifecycle('load', clientId, data.pageQuery);
        render(createElement(component, {}), null, {
          driver,
        });

        // 初始化 ready 事件, after render
        $emitPageLifecycle('ready', clientId, {});
        self.__current_client_id__ = clientId;
      });

      break;

    case 'event':
    case 'return':
      emitToClient(clientId, 'message', { data });
      break;

    case 'callEnd':
      // ignore
      break;

    case 'app:lifecycle': {
      const { lifecycle } = data;
      $emitAppLifecycle(lifecycle, {});
      break;
    }
    case 'page:lifecycle': {
      const { clientId, lifecycle } = data;
      $emitPageLifecycle(lifecycle, clientId, {});
      if (lifecycle === 'show') {
        self.__current_client_id__ = clientId;
      }
      break;
    }

    case 'updatePageData': {
      try {
        $emitPageLifecycle('updatePageData', clientId, data.data);
      } catch (err) {
        warn('update page data err', err);
      }
      break;
    }

    default:
      warn('Unknown message', data);
      break;
  }
});
