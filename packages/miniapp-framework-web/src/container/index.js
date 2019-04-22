import spawnWorker from 'worker-loader?inline&fallback=false!babel-loader!../worker';
import MessageRouter from './MessageRouter';
import resolvePathname from './resolve-pathname';
import { getMiniAppEnv } from './env';
import my from './my';

const hasOwn = {}.hasOwnProperty;
const COMPATIBLE_APP_CONFIG_KEY = 'APP_MANIFEST';
const ASSET_KEY = 'h5Assets';
const PLUGIN_KEY = 'plugins';
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

  send('setEnv', { env: getMiniAppEnv() }, TARGET_WORKER);

  send('importScripts', {
    url: getAssetUrl(appConfig),
  }, TARGET_WORKER);

  if (PLUGIN_KEY in appConfig) {
    const plguinConfig = appConfig[PLUGIN_KEY];
    const plugins = Object.keys(plguinConfig);
    for (let i = 0, l = plugins.length; i < l; i++) {
      const { bundlePath } = plguinConfig[plugins[i]];
      if (!bundlePath) continue;
      send('importScripts', {
        url: normalizePathToURL(bundlePath),
      }, TARGET_WORKER);
    }
  }

  send('registerAPI', {
    apis: Object.keys(my),
  }, TARGET_WORKER);

  send('app:lifecycle', {
    lifecycle: 'launch',
  }, TARGET_WORKER);

  return { worker, messageRouter };
}


/**
 * Compatible to old version of miniapp framework.
 * If APP_MANIFEST exists in window, automaticlly init miniapp.
 */
if (hasOwn.call(window, COMPATIBLE_APP_CONFIG_KEY)) {
  startMiniAppWeb(window[COMPATIBLE_APP_CONFIG_KEY], document.body);
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
  return normalizePathToURL(url);
}

/**
 * Normalize asset path to absolute url.
 * eg: 1. relative path like `app.js` or `../app.js` or `path/to/app.js`
 *     2. absolute path like `/app.js`
 *     3. cross origin path like `https://path.to/app.js`
 * @param path {String} Original path.
 * @return {String} Normalized URL.
 */
function normalizePathToURL(path) {
  if (isRemoteOriginPath(path)) {
    return path;
  } else {
    return location.origin + resolvePathname(path, location.pathname);
  }
}

const REMOTE_ORIGIN_RE = /^https?:\/\//;
function isRemoteOriginPath(path) {
  return REMOTE_ORIGIN_RE.test(path);
}
