import domRenderer from 'rax-miniapp-renderer';
import handleModuleAPIEvent from './moduleAPIEvent';

const TAG_NAME_PREFIX = 'a-';

export default function renderDOM(workerHandle, mountNode, clientId, pageQuery = {}, window) {
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
  const { documentElement } = window.document;
  documentElement.style.fontSize = documentElement.clientWidth / 750 * 100 + 'px';

  return domRenderer({
    worker: workerHandle,
    tagNamePrefix: TAG_NAME_PREFIX,
    mountNode,
  });
}
