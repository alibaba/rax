/**
 * RPC Protocol reference and minimal
 * implimentation of DDP's RPC part
 */
export default class RPCServer {
  constructor({ postMessage }) {
    this.postMessage = postMessage;
  }

  receiver(evt) {
    const { data, id } = evt;
    this[data.type](id, data);
  }

  /**
   * Response connected immediately to client
   */
  connect(id, data) {
    this.send(id, { type: 'connected', id: data.id });
  }

  /**
   * Response to method procedure:
   * result (server -> client):
   *  id: string (the id passed to 'method')
   *  error: optional Error (an error thrown by the method (or method-not-found)
   *  result: optional item (the return value of the method, if any)
   */
  method(id, data) {
    const methodSplited = data.method.split('.');
    const params = this.parse(data.params);

    let instance = window;
    let scope = window;
    for (let i = 0, l = methodSplited.length; i < l && instance; i++ ) {
      scope = instance;
      instance = instance[methodSplited[i]];
    }

    try {
      const result = instance.apply(scope, params);
      this.send(id, {
        type: 'result',
        id: data.id,
        result: this.stringify(result),
        error: null,
      });
    } catch (error) {
      this.send(id, {
        type: 'result',
        id: data.id,
        result: null,
        error: this.stringify({ message: error.message }),
      });
    }
  }

  send(id, data) {
    this.postMessage({ type: 'rpc', id, data });
  }

  parse(str) {
    return JSON.parse(str);
  }

  stringify(data) {
    return JSON.stringify(data);
  }
}
