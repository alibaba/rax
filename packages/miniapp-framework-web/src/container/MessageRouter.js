import { debug, log } from 'miniapp-framework-shared';
import renderContainerShell from './view';
import my from './my';

export default class MessageRouter {
  /**
   * Worker handle.
   * @param workerHandle {Object}
   * @param appConfig {Object}
   * @param mountNode {HTMLElement}
   */
  constructor(workerHandle, appConfig, mountNode) {
    this._worker = workerHandle;
    this._appConfig = appConfig;
    this._mountNode = mountNode;
    this._channels = {};
    workerHandle.addEventListener('message', this.eventHandler);

    // 兼容 atag 中 navigator 的调用
    window.__renderer_to_worker__ = (payload) => {
      /* protocol for renderer to worker */
      this.eventHandler({
        data: {
          target: 'AppWorker',
          payload
        }
      });
    };
  }

  /**
   * Create a message chennel, which is an object with following protocol:
   *   onmessage: [MessageEventHandler]
   *   postMessage: [PostMessageToAnotherPoint]
   */
  createMessageChannel(channelName, { clientId, pageName }) {
    const messageRouter = this;
    return this._channels[channelName] = {
      /**
       * Send message from renderer to worker.
       * @param message
       */
      postMessage(message) {
        // add clientId and pageName for payload.
        const payload = { pageName, clientId, ...message };
        const data = { target: 'AppWorker', payload };
        debug(`r@${clientId}->w`, data);
        messageRouter.eventHandler({ data });
      },
      /**
       * Send message from worker to renderer.
       * onmesssage should be override.
       */
      onmessage() {
        log(`w->r@${clientId}`, 'Unexpected handler of message.');
      },
    };
  }

  /**
   * Console message.
   * @param data
   */
  console(data) {
  }

  handleMessageFromWorker(data) {
    switch (data.type) {
      case 'r$':
        const { navigation, tabbar } = renderContainerShell(this, this._appConfig, this._mountNode);
        this._navigation = navigation;
        this._tabbar = tabbar;
        break;
      case 'call':
        this.handleRemoteCall(data);
    }
  }

  handleRemoteCall(data) {
    const {
      method,
      params,
      callId
    } = data;

    switch (method) {
      case 'navigateTo':
      case 'navigateBack':
      case 'redirectTo':
        this._navigation[method](params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'switchTab':
      case 'showTabBar':
      case 'hideTabBar':
      case 'setTabBarBadge':
      case 'removeTabBarBadge':
      case 'showTabBarRedDot':
      case 'hideTabBarRedDot':
        this._tabbar[method](params);
        this.callbackRemoteCall(callId, null, null);
        break;

      default:
        const resolveCallback = (result) => {
          this.callbackRemoteCall(callId, null, result);
        };
        const rejectCallback = (err) => {
          this.callbackRemoteCall(callId, err, null);
        };

        if (my[method]) {
          my[method](params, resolveCallback, rejectCallback);
        } else {
          log('WARN: API Module not exists or supported.');
        }
    }
  }

  callbackRemoteCall(callId, error, result) {
    this._worker.postMessage({
      type: 'callEnd', callId, error, result
    });
  }

  defaultHandler(data) {
    console.warn('Can not recognize message handler', data);
  }

  /**
   * Receive message from worker
   */
  eventHandler = (evt) => {
    /**
     * Message:
     *  { type: String, target: String, ...others }
     */
    const { data } = evt;
    if (!data) {
      log('Receive illegal data', evt);
      return;
    }

    const { target, payload } = data;
    if (target === 'AppWorker') {
      this._worker.postMessage(data);
    } else if (target === 'AppContainer') {
      this.handleMessageFromWorker(payload);
    } else if (this._channels[target]) {
      this._channels[target].onmessage(payload);
    } else {
      this.defaultHandler(data);
    }
  }
}
