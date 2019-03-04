import { debug, log } from 'miniapp-framework-shared';
import renderContainerShell from './view';
import my from './modules/my';

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
        const { router, tabbar } = renderContainerShell(this, this._appConfig, this._mountNode);
        this._router = router;
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
        this._router.navigateTo({ pageName: params.url });
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'navigateBack':
        this._router.navigateBack(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'redirectTo':
        this._router.redirectTo(params);
        this.callbackRemoteCall(callId, null, null);
      case 'switchTab':
        this._router.switchTab(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'showTabBar':
        this._tabbar.showTabBar(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'hideTabBar':
        this._tabbar.hideTabBar(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'setTabBarBadge':
        this._tabbar.setTabBarBadge(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'removeTabBarBadge':
        this._tabbar.setTabBarBadge(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'showTabBarRedDot':
        this._tabbar.setTabBarBadge(params);
        this.callbackRemoteCall(callId, null, null);
        break;
      case 'hideTabBarRedDot':
        this._tabbar.setTabBarBadge(params);
        this.callbackRemoteCall(callId, null, null);
        break;

      default:
        function resolveCallback(result) {
          this.callbackRemoteCall(callId, result, null);
        }

        function rejectCallback(err) {
          this.callbackRemoteCall(callId, null, err);
        }

        if (my[method]) {
          my[method](params, resolveCallback, rejectCallback);
        } else {
          console.warn('API Module not exists or supported.');
        }
    }
  }

  callbackRemoteCall(callId, error, result) {
    this._worker.postMessage({
      type: 'callEnd', callId, error, result
    });
  }

  defaultHandler(data) {
    // if (data.type) {
    //   const [type, clientId] = data.type.split('@');
    //   // messageChanel.onModuleAPIEvent({ ...data, type });
    // }
    console.log('落入 default message handler', data);
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
