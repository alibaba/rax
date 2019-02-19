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
    if (!appConfig) {
      throw new Error('App config not load properly, please check your args.');
    }

    const mountNode = options.mountNode || document.body;
    this.mountNode = mountNode;
    this.context = startMiniApp(appConfig, mountNode);
  }

  destory() {
    this.context.worker.terminate();
    this.mountNode.innerHTML = '';
  }
}
