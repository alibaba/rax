/* global module, exports, define */
import startMiniApp from './container';

export default class MiniApp {
  static type = 'web';

  /**
   * Start a MiniApp IDE
   * @param appConfig {Object} MiniApp config.
   * @param options {Object} Bootstarp options
   * @param options.mountNode {HTMLElement} Default to document.body.
   */
  constructor(appConfig, options = {}) {
    const mountNode = options.mountNode || document.body;
    this.mountNode = mountNode;
    this.context = startMiniApp(appConfig, mountNode);
  }

  desctoy() {
    this.context.worker.terminate();
    this.mountNode.innerHTML = '';
  }
}
