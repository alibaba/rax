export default class RemoteESSync {
  pendingPromiseMap = {};
  _procedureCount = 0;

  constructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const { resolve, reject } = this.pendingPromiseMap[data.id];
    if (data.error) {
      reject(data.error);
    } else {
      resolve(data.result);
    }
  }

  send(data) {
    this.sender && this.sender({
      type: 'RemoteESSync',
      data,
    });
  }

  /**
   * Query a variable's value.
   */
  query(varExp) {
    return this._invoke('query', { varExp });
  }

  /**
   * Call a specfic method with params.
   */
  method(method, params) {
    return this._invoke('method', { method, params });
  }

  /**
   * Assign value to an variable.
   */
  assign(varExp, value) {
    return this._invoke('assign', { varExp, value });
  }

  _invoke(type, data) {
    const id = this.generateId();
    return new Promise((resolve, reject) => {
      this.send({ id, type, ...data });
      this.pendingPromiseMap[id] = { resolve, reject };
    });
  }

  /**
   * Generate a unique procedure id.
   */
  generateId() {
    return this._procedureCount++;
  }

}
