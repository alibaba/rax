import { getDOMRender } from './domRender';
import { getMessageProxy } from '../container/MessageProxy';
import { createConsoleHandler } from '../../../miniapp-framework/src/renderer/ConsoleHandler';
import { createModuleAPIHandler } from './ModuleAPIHandler';
import { setupAppear } from '../../../miniapp-framework/src/renderer/appear';
import { setupTheme } from '../../../miniapp-framework/src/renderer/atagTheme';
import { setupTap } from '../../../miniapp-framework/src/renderer/tap';
import { initReachBottom } from '../../../miniapp-framework/src/renderer/reachBottom';

export default function initRenderer(window, clientId, pageQuery, themeConfig) {
  const { document } = window;
  /**
   * @HACK: fix safari mobile click events aren't fired.
   * https://developer.mozilla.org/en-US/docs/Web/Events/click#Safari_Mobile
   */
  const isTouchDevice = 'ontouchstart' in document || 'onmsgesturechange' in document;
  const { documentElement } = document;
  if (isTouchDevice) documentElement.style.cursor = 'pointer';

  // Set rem
  documentElement.style.fontSize = documentElement.clientWidth / 750 * 100 + 'px';

  setupAppear(window);
  setupTap(window);
  initReachBottom(window);
  if (themeConfig) {
    setupTheme(themeConfig, window);
  }


  const workerHandler = getMessageProxy(clientId);
  getDOMRender(window)({
    worker: workerHandler,
    tagNamePrefix: 'a-',
  });

  // todo: renderer to worker
  // window.__renderer_to_worker__ = function(payload) {
  //   transferBus.postMessage(payload);
  // };

  setWorkerHandle(workerHandler, 'onModuleAPIEvent', createModuleAPIHandler(window));
  setWorkerHandle(workerHandler, 'onConsole', createConsoleHandler(window));
}

function setWorkerHandle(workerHandler, property, value) {
  workerHandler[property] = value;
}

