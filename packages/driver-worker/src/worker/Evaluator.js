export default class Evaluator {
  _taskPending = {};
  _id = 0;

  constructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const task = this._taskPending[data.id];
    // Task only can be resolved once.
    if (task) {
      const { resolve, reject } = task;
      if (data.type === 'success') {
        resolve(data.success);
      } else if (data.type === 'error') {
        reject(data.error);
      }

      this._taskPending[data.id] = null;
    }
  }

  _send(data) {
    this.sender({
      type: 'EvaluationRecord',
      data,
    });
  }

  /**
   * Query a variable's value.
   * get('location.href')
   */
  get(expression) {
    return this._eval({ code: expression });
  }

  /**
   * Assign value to an variable.
   * set('location.href', value)
   */
  set(expression, value) {
    return this._eval({ code: `${expression}=${value}` });
  }

  /**
   * Delete an variable.
   * delete('location.href')
   */
  delete(expression) {
    return this._eval({ code: `delete ${expression}` });
  }

  /**
   * Call a specfic method with params.
   * call('location.replace', '')
   */
  call(method) {
    var params = [];
    for (var l = arguments.length, i = 1; i < l; i++) {
      params[i - 1] = JSON.stringify(arguments[i]);
    }
    return this._eval({ code: `${method}(${params.toString()})` });
  }

  _eval({ code }) {
    const id = this._generateId();
    return new Promise((resolve, reject) => {
      this._taskPending[id] = { resolve, reject };
      this._send({ type: 'eval', id, code });
    });
  }

  /**
   * Generate a unique procedure id.
   */
  _generateId() {
    return this._id++;
  }
}
