import { debug } from '../../../core/debugger';

const transferBus = {};
window.$$workerTransfers = transferBus;

export function createTransferBus(clientId, pageName) {
  return {
    postMessage(msg) {
      msg.pageName = pageName;
      msg.clientId = clientId;
      window.$$worker.postMessage(msg);
      debug(`转发 renderer.${clientId} -> worker`, msg);
    }
  };
}

export function set(clientId, bus) {
  return transferBus[clientId] = bus;
}

export function get(clientId) {
  return transferBus[clientId];
}
