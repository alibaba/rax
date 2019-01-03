import spawnWorker from 'worker-loader?inline&fallback=false!babel-loader!./worker';
import { createWorkerHandler } from './MessageHandler';
import getAssetUrl from './getAssetUrl';

// Pre created worker.
export const rootWorker = spawnWorker();

/**
 * Initialize MiniApp IDE.
 * @param appConfig {Object} MiniApp config.
 * @param mountNode {HTMLElement} Default to document.body.
 */
export default function startMiniApp(appConfig, mountNode = document.body) {
  rootWorker.addEventListener('message', createWorkerHandler(rootWorker));
  rootWorker.postMessage({
    type: 'importScripts',
    url: getAssetUrl(appConfig),
  });
}

/**
 * Compatible to old version of miniapp framework.
 * If APP_MANIFEST exists in window, automaticlly init miniapp.
 */
if ('APP_MANIFEST' in window) {
  startMiniApp(window.APP_MANIFEST);
}

// TODO: @缇欧
// window.__update_page_data__ = (clientId, data) => {
//   workerHandle.postMessage({
//     type: 'updatePageData',
//     clientId,
//     data,
//   });
// };

