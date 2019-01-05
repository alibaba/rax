import spawnWorker from '!!worker-loader?inline&fallback=false!babel-loader!../worker';
import { debug, warn } from '../../../core/debugger';
import { $call } from './modules/index';
import { get as getBus } from './transferBus';
import render from './render';
import my from './modules/my';


export default function startMiniAppWeb(appConfig, mountNode) {
  const worker = window.worker = spawnWorker();

  window.__update_page_data__ = (clientId, data) => {
    worker.postMessage({
      type: 'updatePageData',
      clientId,
      data,
    });
  };

  let appRegistered = false;
  let apiRegistered = false;

  worker.onmessage = ({ data }) => {
    const { pageName, clientId, type } = data || {};

    const bus = getBus(clientId);
    switch (type) {
      case 'w2r':
        debug(`转发 worker -> renderer.${clientId}`, data);
        bus.onmessage.call(this, data);
        break;

      case 'console':
        const transferBus = getBus(clientId);
        if (transferBus && transferBus.onconsole) {
          transferBus.onconsole(data);
        }
        break;

      case 'call':
        const { module, method, params, callId } = data;

      function resolveCallback(result) {
        worker.postMessage({
          type: 'callEnd',
          status: 'resolved',
          result,
          callId,
        });
      }
      function rejectCallback(err) {
        worker.postMessage({
          type: 'callEnd',
          status: 'reject',
          err: {
            message: err.message,
            type: err.type,
            stack: err.stack,
          },
          callId,
        });
      }

        $call(module, method, params, resolveCallback, rejectCallback);
        break;

      case 'AppRegistered': {
        appRegistered = true;
        registerReady();
        break;
      }

      case 'APIRegistered': {
        apiRegistered = true;
        registerReady();
        break;
      }

      default: {
        if (data.type) {
          const [type, clientId] = data.type.split('@');
          const transferBus = getBus(clientId);
          if (transferBus && transferBus.onModuleAPIEvent) {
            transferBus.onModuleAPIEvent({
              ...data,
              type,
            });
            break;
          }
        }
        warn('unknown event type', data);
        break;
      }
    }
  };

  function registerReady() {
    if (appRegistered && apiRegistered) {
      render(appConfig);
    }
  }

  // tell worker to load pages
  // @hack fix h5Assets reletive url whith location
  let h5AssetsUrl = appConfig.h5Assets;

  if (!/^https?:\/\//.test(h5AssetsUrl)) {
    let h5AssetsAbsoluteUrl = new URL(location.origin);
    h5AssetsAbsoluteUrl.pathname = h5AssetsUrl;
    h5AssetsUrl = h5AssetsAbsoluteUrl.toString();
  }

  worker.postMessage({
    type: 'importScripts',
    url: h5AssetsUrl,
    urlType: 'app',
  });

  worker.postMessage({
    type: 'registerAPI',
    apis: Object.keys(my),
  });

}
