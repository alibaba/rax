import spawnWorker from 'worker-loader?inline&fallback=false!babel-loader!../worker';
import MessageRouter from './MessageRouter';
import my from './modules/my';

const hasOwn = {}.hasOwnProperty;
const COMPATIBLE_APP_CONFIG_KEY = 'APP_MANIFEST';
const ASSET_KEY = 'h5Assets';
const TARGET_WORKER = 'AppWorker';

/**
 * Initialize MiniApp Web.
 * @param appConfig {Object} MiniApp config.
 * @param mountNode {HTMLElement} Default to document.body.
 */
export default function startMiniAppWeb(appConfig, mountNode) {
  const worker = spawnWorker();
  const messageRouter = new MessageRouter(worker, appConfig, mountNode);
  function send(type, data, target) {
    worker.postMessage({
      target,
      payload: { type, ...data },
    });
  }

  send('importScripts', {
    url: getAssetUrl(appConfig),
  }, TARGET_WORKER);
  send('registerAPI', {
    apis: Object.keys(my),
  }, TARGET_WORKER);

  return { worker, messageRouter };
}


/**
 * Compatible to old version of miniapp framework.
 * If APP_MANIFEST exists in window, automaticlly init miniapp.
 */
if (hasOwn.call(window, COMPATIBLE_APP_CONFIG_KEY)) {
  startMiniAppWeb(window[COMPATIBLE_APP_CONFIG_KEY]);
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
