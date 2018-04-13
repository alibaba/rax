const eventTarget = require('event-target-shim');

const WEB_SOCKET_MODULE = '@weex-module/webSocket';

const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

const CLOSE_NORMAL = 1000;

const WEBSOCKET_EVENTS = [
  'close',
  'error',
  'message',
  'open',
];

/**
 * Event object passed to the `onopen`, `onclose`, `onmessage`, `onerror`
 * callbacks of `WebSocket`.
 *
 * The `type` property is "open", "close", "message", "error" respectively.
 *
 * In case of "message", the `data` property contains the incoming data.
 */
class WebSocketEvent {
  constructor(type, eventInitDict) {
    this.type = type.toString();
    Object.assign(this, eventInitDict);
  }
}

module.exports = function(__weex_require__) {
  /**
   * Browser-compatible WebSockets implementation.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
   * See https://github.com/websockets/ws
   */
  class WebSocket extends eventTarget(WEBSOCKET_EVENTS) {
    static CONNECTING = CONNECTING;
    static OPEN = OPEN;
    static CLOSING = CLOSING;
    static CLOSED = CLOSED;

    constructor(url, protocols) {
      super();

      let websocket = __weex_require__(WEB_SOCKET_MODULE);
      // eslint-disable-next-line new-cap
      websocket.WebSocket(url, protocols);
      this.readyState = CONNECTING;
      this.websocket = websocket;

      websocket.onmessage(ev => {
        this.dispatchEvent(new WebSocketEvent('message', ev));
      });

      websocket.onopen(ev => {
        this.readyState = OPEN;
        this.dispatchEvent(new WebSocketEvent('open'));
      });

      websocket.onclose(ev => {
        this.readyState = CLOSED;
        this.dispatchEvent(new WebSocketEvent('close', {
          code: ev.code,
          reason: ev.reason,
        }));
      });

      websocket.onerror(ev => {
        this.dispatchEvent(new WebSocketEvent('error', ev));
      });
    }

    close(code, reason) {
      if (this.readyState === CLOSING ||
          this.readyState === CLOSED) {
        return;
      }

      this.readyState = CLOSING;
      this.websocket.close(code, reason);
    }

    send(data) {
      if (typeof data === 'string') {
        this.websocket.send(data);
        return;
      }

      throw new Error('Unsupported data type');
    }
  }

  return WebSocket;
};
