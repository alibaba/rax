import global from '../../shared/global';

export default class RemoteESSyncHandler {
  costructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const { type } = data;
    this[type](data);
  }

  returnWithResult(id, result) {
    this.send({ type: 'result', id, result });
  }

  returnWithError(id, error) {
    this.send({ type: 'result', id, error });
  }

  send(data) {
    this.sender && this.sender({
      type: 'RemoteESSync',
      data,
    });
  }

  /**
   * Query a global variable's val
   * payload: { varExp: 'location.href[0]' }
   * returns: value
   */
  query({ id, varExp }) {
    try {
      const { value } = this.resolveMemberExpression(varExp);
      this.returnWithResult(id, value);
    } catch (err) {
      this.returnWithError(id, 'Can not get value of ' + key);
    }
  }

  /**
   * Call a method
   * payload: { method: 'location.replace', params: ['/foo.html'] }
   * returns: executed result
   */
  method({ id, method, params }) {
    try {
      const { scope, value } = this.resolveMemberExpression(method);
      this.resolve(id, value.apply(scope, params));
    } catch (err) {
      this.reject(id, 'Can not call ' + expression);
    }
  }

  /**
   * Assign value to some variable
   */
  assign({ id, varExp, value }) {
    // todo
  }

  resolveMemberExpression(exp, scope = global) {
    let i = 0, ref = scope, current = '';
    while (exp[i]) {
      if (exp[i] === '.' || exp[i] === '[') {
        ref = ref[current];
        current = '';
      } else if (exp[i] === ']' || exp[i] === ' ') {
        // Skip
      } if (exp[i] === '#') {
        ref = scope;
      } else {
        current += exp[i];
      }
      i++;
    }
    return { scope: ref, value: ref[current] };
  }
}
