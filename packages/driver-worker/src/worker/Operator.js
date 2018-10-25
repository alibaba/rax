export default class Operator {
  pendingPromiseMap = {};
  _procedureCount = 0;

  constructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const { resolve, reject } = this.pendingPromiseMap[data.id];
    if (data.type === 'success') {
      resolve(data.success);
    } else if (data.type === 'error') {
      reject(data.error);
    }
  }

  send(data) {
    this.sender({
      type: 'OperationRecord',
      return: data,
    });
  }

  /**
   * Query a variable's value.
   */
  get(varExp) {
    return this._invoke('get', { varExp });
  }

  /**
   * Assign value to an variable.
   */
  set(varExp, value) {
    return this._invoke('set', { varExp, value });
  }

  /**
   * Delete an variable.
   */
  delete(varExp, value) {
    return this._invoke('delete', { varExp, value });
  }

  /**
   * Call a specfic method with params.
   */
  call(method, params) {
    return this._invoke('call', { method, params });
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
