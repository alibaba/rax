import { debug } from 'miniapp-framework-shared';
import { setupAppear, setupTap, setupTheme, setupReachBottom } from 'miniapp-framework-shared/src/renderer';
import { getClientId, getPageName, parsePageQuery } from './env';
import { compat } from './compatible';
import setupDriverHandler from './setupDriverHandler';
import setupAPIAdapter from './apiAdapter';
import setupRenderToWorker from './renderToWorker';
import createWindmill from '../vendors/windmill-renderer.min';
import { consoleDataCusumer } from './console';
import startRemoteInspect from './remoteInspect';

compat();
setupAppear(window);
setupTap(window);
setupReachBottom(window);

/**
 * Create a handle to communicate with worker.
 * @Note: pass an empty object as first arg.
 */
const windmill = createWindmill({});
setupDriverHandler(windmill);
setupAPIAdapter(windmill);
setupRenderToWorker(windmill, { pageName: getPageName() });

/**
 * Emit an clientReady event from renderer to worker
 * immediately after renderer listeners were setup.
 */
const clientReadyEvent = 'r$';
const clientReadyPayload = {
  clientId: getClientId(),
  pageName: getPageName(),
  pageQuery: parsePageQuery(),
};
windmill.$emit(clientReadyEvent, clientReadyPayload, 'AppWorker');

/**
 * Theme: init CSS variables
 */
windmill.$call('miniApp.getConfig', {}, function(response) {
  const themeConfig = response ? response.themeConfig : {};
  setupTheme(themeConfig, window);
}, (err) => {
  debug('Error: miniApp.getConfig', err);
});

/**
 * Console debugger.
 */
windmill.$on('console', ({ data }) => {
  consoleDataCusumer(data);
});

/**
 * Start remote debugger
 */
if (hasOwnProperty(clientReadyPayload.pageQuery, 'remoteInspectUrl')) {
  startRemoteInspect(clientReadyPayload.pageQuery.remoteInspectUrl);
}

/**
 * Has own property of an object.
 */
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
