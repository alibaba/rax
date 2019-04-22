import raxCode from '!!raw-loader!rax/dist/rax.min.js';
import createDriver from 'driver-worker';
import { log, worker } from 'miniapp-framework-shared';
import { applyFactory } from './getModule';
import { emit as emitPageLifecycle } from './lifecycles/page';

const raxFactory = new Function('module', 'exports', raxCode);
const { getPage, getUnknownPageFactory } = worker.pageHub;
const { on: addClientEvent } = worker.clientHub;
const CURRENT_CLIENT_ID = '__current_client_id__';
const MINIAPP_ENV = '__miniapp_env__';

export default class Client {
  constructor(clientId, pageName, pageQuery = {}) {
    this.clientId = clientId;
    this.pageName = pageName;
    this.pageQuery = pageQuery;
    this.raxInstance = createRax();
    this.eventListeners = {};

    this.setup();
  }

  setup() {
    const { createElement, render } = this.raxInstance;
    const driver = this.driver = createDriver({
      postMessage: this.sendMessageToRenderer,
      addEventListener: this.addClientEvent,
    });
    driver.setDeviceWidth(global[MINIAPP_ENV].windowWidth);

    const component = this.component = this.instantiatePage();
    // 页面加载时触发
    this.emitEvent('load', this.pageQuery);
    render(createElement(component, {}), null, {
      driver,
    });

    // 初始化 ready 事件, after render
    this.emitEvent('ready', {});
    global[CURRENT_CLIENT_ID] = this.clientId;
  }

  instantiatePage() {
    let component;
    try {
      const { document, evaluator } = this.driver;
      let { factory } = getPage(this.pageName, this.raxInstance);
      component = applyFactory(factory, {
        page: this,
        clientId: this.clientId,
        pageName: this.pageName,
        rax: this.raxInstance,
        pageQuery: this.pageQuery,
        document,
        evaluator,
      });
    } catch (err) {
      log('Instantite page with error, catch and show error page.');
      console.error(err);
      component = applyFactory(getUnknownPageFactory(this.raxInstance, '加载出现了错误'));
    }
    return component;
  }

  /**
   * w2r means
   *   worker2renderer
   */
  sendMessageToRenderer = (message) => {
    postMessage({
      target: this.clientId,
      payload: {
        type: 'w2r',
        pageName: this.pageName,
        clientId: this.clientId,
        data: message,
      },
    });
  };

  addClientEvent = (eventName, callback) => {
    addClientEvent(this.clientId, eventName, callback);
  };

  /**
   * Add event listener.
   * @param evtName
   * @param callback
   */
  on(evtName, callback) {
    const { eventListeners } = this;

    const cycles = eventListeners[evtName] = eventListeners[evtName] || [];
    cycles.push(callback);
  }

  /**
   * Remove event listener
   * @param evtName
   * @param callback
   */
  off(evtName, callback) {
    const { eventListeners } = this;

    const cycles = eventListeners[evtName] = eventListeners[evtName] || [];
    const idx = cycles.indexOf(callback);
    if (idx > -1) {
      cycles.splice(idx, 1);
    }
  }

  /**
   * Emit a event with payload.
   * @param eventName
   * @param payload
   */
  emitEvent(eventName, payload) {
    // const { eventListeners } = this;
    // if (Array.isArray(eventListeners[eventName])) {
    //   eventListeners[eventName].forEach(callback => callback(payload));
    // }
    emitPageLifecycle(eventName, this.clientId, {});
  }

  render() {
    const { render, createElement } = this.raxInstance;
    return render(createElement(this.component), null, {
      driver: this.driver,
    });
  }
}

/**
 * Generate a unique rax instance.
 * @return {Object} Rax instance.
 */
function createRax() {
  return applyFactory(raxFactory);
}
