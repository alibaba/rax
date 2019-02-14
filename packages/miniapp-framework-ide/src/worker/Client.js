import createDriver from 'driver-worker';
import { error } from '../../../miniapp-framework-shared/src/debugger';
import { getPage, getUnknownPageFactory } from '../../../miniapp-framework-shared/src/worker/pageHub';
import { on as addClientEvent } from '../../../miniapp-framework-shared/src/worker/clientHub';
import { createRax, applyFactory } from './utils';

const CURRENT_CLIENT_ID = '__current_client_id__';

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
    const { document, evaluator } = this.driver;
    const { factory } = getPage(this.pageName, this.raxInstance);
    let component;
    try {
      component = applyFactory(factory, {
        page: this,
        clientId: this.clientId,
        pageName: this.pageName,
        raxInstance: this.raxInstance,
        pageQuery: this.pageQuery,
        document,
        evaluator,
      });
    } catch (err) {
      error('Instaniate page with error', err);
      component = applyFactory(
        getUnknownPageFactory(this.raxInstance, {
          message: '加载出现了错误',
        })
      );
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
    const { eventListeners } = this;
    if (Array.isArray(eventListeners[eventName])) {
      eventListeners[eventName].forEach(callback => callback(payload));
    }
  }

  render() {
    const { render, createElement } = this.raxInstance;
    return render(createElement(this.component), null, {
      driver: this.driver,
    });
  }
}
