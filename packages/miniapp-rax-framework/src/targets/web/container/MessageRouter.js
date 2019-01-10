import { warn } from '../../../core/debugger';
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
   * @param data
   */
  navigator(data) {
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
        renderContainerShell(this, this._appConfig, this._mountNode);
        break;
    }
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
