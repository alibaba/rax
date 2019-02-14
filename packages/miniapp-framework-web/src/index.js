/* global module, exports, define */
import startMiniApp from './container';

const LIBRARY_NAME = 'MiniApp';

class MiniApp {
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

/**
 * UMD expose.
 */
(function universalModuleDefinition(root, factory) {
  // CommonJS2
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  // AMD
  else if (typeof define === 'function' && define.amd)
    define([LIBRARY_NAME], factory);
  // CommonJS
  else if (typeof exports === 'object')
    exports[LIBRARY_NAME] = factory();
  // Global
  else
    root[LIBRARY_NAME] = factory();
})(global, () => MiniApp);
