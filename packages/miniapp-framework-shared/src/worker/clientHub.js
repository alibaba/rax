import { log, debug } from '../logger';

const listeners = {};
const CLIENTS = {};

export function addClient(clientId, client) {
  CLIENTS[clientId] = client;
}

export function getClient(clientId) {
  return CLIENTS[clientId];
}

export function on(clientId, evtName, callback) {
  if (!listeners[clientId]) {
    listeners[clientId] = {};
  }
  if (!listeners[clientId][evtName]) {
    listeners[clientId][evtName] = [];
  }

  listeners[clientId][evtName].push(callback);
}

export function emit(clientId, evtName, payload) {
  debug('Emit event:', clientId, evtName, payload);
  if (!listeners[clientId] || !listeners[clientId][evtName]) {
    debug(
      `emit an unregistered event, clientId: ${clientId}, evtName: ${evtName}`
    );
    return;
  }
  for (let i = 0, l = listeners[clientId][evtName].length; i < l; i++) {
    listeners[clientId][evtName][i](payload);
  }
}

export function off(clientId, evtName, callback) {
  if (!listeners[clientId] || !listeners[clientId][evtName]) {
    return;
  }
  for (let i = 0, l = listeners[clientId][evtName].length; i < l; i++) {
    if (listeners[clientId][evtName][i] === callback) {
      listeners[clientId][evtName].splice(i, 1);
      break;
    }
  }
}
