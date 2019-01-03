import { debug, warn } from '../../core/debugger';
import { rootWorker } from '.';

const chanels = {};

/**
 * Create a message chanel, which is an object with following protocol:
 *   onmessage: [MessageEventHandler]
 *   postMessage: [PostMessageToAnotherPoint]
 */
export function createMessageChanel(clientId, pageName) {
  return chanels[clientId] = {
    postMessage(message) {
      // add clientId and pageName for payload.
      const payload = { pageName, clientId, ...message };
      debug(`r@${clientId}->w`, payload);
      rootWorker.postMessage(payload);
    },
    /**
     * onmesssage should be override.
     */
    onmessage() {
      warn(`w->r@${clientId}`, 'Unespected handler of message.');
    },
  };
}

export function getMessageChanel(clientId) {
  return chanels[clientId];
}
