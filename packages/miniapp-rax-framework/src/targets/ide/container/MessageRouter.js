import { debug, warn } from '../../../core/debugger';
// import { onRoute } from '../routes';
import renderContainerShell from './view';

export default class MessageRouter {
  /**
   * Worker handle.
   * @param workerHandle {Object}
   */
  constructor(workerHandle, appConfig, mountNode) {
    this._worker = workerHandle;
    this._appConfig = appConfig;
    this._mountNode = mountNode;
    this._channels = {};
    workerHandle.addEventListener('message', this.eventHandler);
  }

  /**
   * Add a route channel for message.
   * @param channelName
   * @param proxy {Object}
   */
  addChannel(channelName, proxy) {
    this._channels[channelName] = proxy;
  }


  /**
   * Navigate message.
   * @param messageChanel
   * @param data
   */
  navigator(messageChanel, data) {
    this.appShell.onRoute(data);
  }

  console(messageChanel, data) {
    messageChanel.onConsole(data);
  }

  call(messageChanel, data) {
    const { module, method, params, callId } = data;
    // TODO: api
    console.error('TODO API CALL');
  }

  handleMessageFromWorker(data) {
    switch (data.type) {
      case 'r$':
        renderContainerShell(this, this._appConfig, this._mountNode);
        break;
    }
  }

  defaultHandler(data) {
    // if (data.type) {
    //   const [type, clientId] = data.type.split('@');
    //   // messageChanel.onModuleAPIEvent({ ...data, type });
    // }
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
      warn('Receive illegal data', evt);
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
