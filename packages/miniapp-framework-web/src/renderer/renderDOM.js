/* global VIEWPORT_WIDTH */
import domRenderer from 'rax-miniapp-renderer/src';
import handleModuleAPIEvent from './moduleAPIEvent';

const TAG_NAME_PREFIX = 'a-';

export default function renderDOM(workerHandle, mountNode, clientId, pageQuery = {}, globalThis = window) {
  const postMessage = workerHandle.postMessage;
  // Hook postMessage
  workerHandle.postMessage = (msg) => {
    if (msg.type === 'init') msg.pageQuery = pageQuery;
    postMessage.call(workerHandle, msg);
  };

  /**
   * Handle with module API events.
   */
  workerHandle.onModuleAPIEvent = handleModuleAPIEvent;

  /**
   * Correct the page font-size
   */
  const { documentElement } = globalThis.document;
  // Correct the page font-size
  const clientWidth = typeof VIEWPORT_WIDTH !== 'undefined' ? VIEWPORT_WIDTH : documentElement.clientWidth;
  documentElement.style.fontSize = clientWidth / 750 * 100 + 'px';

  return domRenderer({
    worker: workerHandle,
    tagNamePrefix: TAG_NAME_PREFIX,
    mountNode,
  });
}
