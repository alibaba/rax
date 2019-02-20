import domRenderer from 'rax-miniapp-renderer';
import handleModuleAPIEvent from './moduleAPIEvent';

const TAG_NAME_PREFIX = 'a-';

/**
 * DOMRenderer
 */
export default class DOMRenderer {
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
