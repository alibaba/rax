import { debug, warn } from '../../../miniapp-framework-shared/src/debugger';

const PROXIES = {};

/**
 * Create a message proxy, which is an object with following protocol:
 *   onmessage: [MessageEventHandler]
 *   postMessage: [PostMessageToAnotherPoint]
 */
export function createMessageProxy(messageRouter, clientId, pageName) {
  return PROXIES[clientId] = {
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
      warn(`w->r@${clientId}`, 'Unespected handler of message.');
    },
  };
}

export function getMessageProxy(clientId) {
  return PROXIES[clientId];
}
