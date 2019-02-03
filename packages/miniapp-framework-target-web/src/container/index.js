import spawnWorker from 'worker-loader?inline&fallback=false!babel-loader!../worker';
import MessageRouter from './MessageRouter';
import my from './modules/my';
import startMiniApp from "../../../miniapp-framework-target-ide/src/container";

const hasOwn = {}.hasOwnProperty;
const COMPATIBLE_APP_CONFIG_KEY = 'APP_MANIFEST';
const ASSET_KEY = 'h5Assets';

/**
 * Initialize MiniApp Web.
 * @param appConfig {Object} MiniApp config.
 * @param mountNode {HTMLElement} Default to document.body.
 */
export default function startMiniAppWeb(appConfig, mountNode) {
  if (!appConfig) {
    throw new Error('App config not load properly, please check your arguments passed to startMiniApp.');
  }

  const worker = spawnWorker();
  const messageRouter = new MessageRouter(worker, appConfig, mountNode);

  worker.postMessage({
    target: 'AppWorker',
    payload: {
      type: 'importScripts',
      url: getAssetUrl(appConfig),
    },
  });

  worker.postMessage({
    target: 'AppWorker',
    payload: {
      type: 'registerAPI',
      apis: Object.keys(my),
    },
  });
  return { worker, messageRouter };
}


/**
 * Compatible to old version of miniapp framework.
 * If APP_MANIFEST exists in window, automaticlly init miniapp.
 */
if (hasOwn.call(window, COMPATIBLE_APP_CONFIG_KEY)) {
  startMiniApp(window[COMPATIBLE_APP_CONFIG_KEY]);
}

/**
 * Get the web asset url.
 * @param appConfig {Object} AppConfig.
 * @return {String} Asset url.
 */
function getAssetUrl(appConfig) {
  if (!hasOwn.call(appConfig, ASSET_KEY)) {
    throw new Error(`Can not parse asset url, please check ${ASSET_KEY} field in appConfig.`);
  }

  const url = appConfig[ASSET_KEY];
  return /^https?:\/\//.test(url) ? url : normalizeURL(url);
}

/**
 * Normalize reletive url by location
 * @param url {String} Original URL.
 * @return {String} Normalized URL.
 */
function normalizeURL(url) {
  let h5AssetsAbsoluteUrl = new URL(location.origin);
  h5AssetsAbsoluteUrl.pathname = url;
  return h5AssetsAbsoluteUrl.toString();
}
