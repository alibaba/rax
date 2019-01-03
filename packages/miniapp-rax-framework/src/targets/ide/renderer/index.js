import { getDOMRender } from './domRender';
import { createConsoleHandler } from '../../../core/renderer/ConsoleHandler';
import { createModuleAPIHandler } from './ModuleAPIHandler';
import { setupAppear } from '../../../core/renderer/appear';
import { setupTheme } from '../../../core/renderer/atagTheme';
import { getMessageChanel } from '../WorkerMessageChanel';
import getAppConfig from '../container/getAppConfig';
import { setupTap } from '../../../core/renderer/tap';

export default function initRenderer(window, clientId, pageQuery) {
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
  setupTheme(getAppConfig().themeConfig, window);

  const workerHandler = getMessageChanel(clientId);
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

