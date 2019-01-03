import { getMessageChanel } from './WorkerMessageChanel';
import { debug, warn } from '../../core/debugger';
import { onRoute } from './routes';
import { renderShell } from './shell';

class MessageHandler {
  /**
   * Send message from worker to renderer.
   * @param messageChanel
   * @param data
   */
  w2r(messageChanel, data) {
    const { clientId } = data;
    debug(`w->r@${clientId}`, data);
    messageChanel.onmessage.call(this, data);
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

  r$() {
    this.appShell = renderShell();
  }

  defaultHandler(messageChanel, data) {
    if (data.type) {
      const [type, clientId] = data.type.split('@');
      messageChanel.onModuleAPIEvent({ ...data, type });
    }
  }

  /**
   * Receive message from worker
   * @param evt
   */
  apply = (evt) => {
    const { data } = evt;
    if (!data) {
      warn('Receive illegal data', evt);
      return;
    }

    const { type, clientId } = data;
    const messageChanel = getMessageChanel(clientId);
    if (this[type]) {
      this[type](messageChanel, data);
    } else {
      this.defaultHandler(messageChanel, data);
    }
  }
}

export function createWorkerHandler(workerHandle) {
  const handler = new MessageHandler(workerHandle);
  return handler.apply;
}
