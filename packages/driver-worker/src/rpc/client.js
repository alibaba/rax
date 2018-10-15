/**
 * RPC Protocol reference and minimal
 * implimentation of DDP's RPC part
 */
export default class RPCClient {
  constructor({ postMessage }) {
    this.msgId = 0;
    this.postMessage = postMessage;
    this.connected = false;
    this.callbacks = {};
    this.pendingPrecedures = [];
    this.connect();
  }

  /**
   * Connect: client -> server
   * negotiation the rpc protocol
   */
  connect() {
    let payload = { type: 'connect' };
    this.send(payload, (data) => {
      if (data.type === 'connected') {
        this.connected = true;
        this.invokePendingProcedures();
      }
    });
  }

  invokePendingProcedures() {
    let fn;
    while (fn = this.pendingPrecedures.shift()) {
      fn();
    }
  }

  send(data, callback) {
    const id = ++this.msgId;
    this.callbacks[id] = callback;
    this.postMessage({ type: 'rpc', id: this.msgId, data });
  }

  receiver(evt) {
    const { data, id } = evt;
    this.callbacks[id] && this.callbacks[id](data);
    /**
     * Automaticly GC once used callbacks
     */
    delete this.callbacks[id];
  }

  /**
   * Call a method by apply, with following protocol:
   * method (client -> server):
   *  method: string (method name)
   *  params: optional array of items (parameters to the method)
   *  id: string (an arbitrary client-determined identifier for this method call)
   */
  apply(method, args, asyncCallback = () => {}) {
    const procedure = () => this.send({
      type: 'method',
      method,
      params: this.stringify(args),
      id: `method-${Math.random()}`,
    }, ({ error, result }) => {
      asyncCallback(error && this.parse(error), result && this.parse(result));
    });
    if (this.connected) {
      procedure();
    } else {
      this.pendingPrecedures.push(procedure);
    }
  }

  stringify(args) {
    return JSON.stringify(args);
  }

  parse(str) {
    return JSON.parse(str);
  }
}
