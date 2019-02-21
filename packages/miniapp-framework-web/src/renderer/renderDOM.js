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

  return new DOMRenderer(workerHandle, mountNode, window);
}

/**
 * DOMRenderer
 */
class DOMRenderer {
  constructor(worker, mountNode, win = window) {
    this.worker = worker;
    this.mountNode = mountNode;
    this.window = win;
    this.document = win.document;
    const { documentElement } = this.document;
    /**
     * Handle with module API events.
     */
    worker.onModuleAPIEvent = handleModuleAPIEvent;

    /**
     * Correct the page font-size
     */
    documentElement.style.fontSize = documentElement.clientWidth / 750 * 100 + 'px';

    this.render();
  }

  render() {
    domRenderer({
      worker: this.worker,
      tagNamePrefix: TAG_NAME_PREFIX,
      mountNode: this.mountNode,
    });
  }
}
