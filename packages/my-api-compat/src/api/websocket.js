import WebSocket from '@core/webSocket';
import EventEmitter from 'eventemitter3';
import { callWithCallback } from '../util';

const bus = new EventEmitter();
const events = [ 'onOpen', 'onError', 'onMessage', 'onClose' ];
let instanceId = 0;
let opened = false;

export function connectSocket(options) {
  if (opened) {
    WebSocket.close({ instanceId });
    opened = false;
    instanceId++;
  }

  WebSocket.webSocket({
    instanceId: instanceId,
    url: options.url,
    protocol: ''
  }, res => {
    opened = true;
    options.success && options.success(res);
    options.complete && options.complete(res);
  }, error => {
    options.fail && options.fail(error);
    options.complete && options.complete(error);
  });

  events.forEach(event => {
    WebSocket[event]({ instanceId }, res => bus.emit(event, res));
  });
}

export function sendSocketMessage(options) {
  callWithCallback(WebSocket.send, options, {
    instanceId,
    data: options.data
  });
}

export function closeSocket(options) {
  WebSocket.close({
    instanceId,
  }, res => {
    opened = false;
    instanceId++;
    options.success && options.success(res);
    options.complete && options.complete(res);
  }, error => {
    options.fail && options.fail(error);
    options.complete && options.complete(error);
  });
}

export function onSocketOpen(cb) {
  bus.on('onOpen', res => cb && cb(res));
}

export function offSocketOpen(cb) {
  bus.removeAllListeners('onOpen');
}

export function onSocketError(cb) {
  bus.on('onError', res => cb && cb(res));
}

export function offSocketError(cb) {
  bus.removeAllListeners('onError');
}

export function onSocketMessage(cb) {
  bus.on('onMessage', res => {
    cb && cb({ data: res, isBuffer: false });
  });
}

export function offSocketMessage() {
  bus.removeAllListeners('onMessage');
}

export function onSocketClose(cb) {
  bus.on('onClose', res => cb && cb(res));
}

export function offSocketClose() {
  bus.removeAllListeners('onClose');
}
