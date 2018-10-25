import global from '../../shared/global';

export default class RemoteESSyncHandler {
  constructor(sender) {
    this.sender = sender;
  }

  apply({ data }) {
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
      const path = resolveMemberExpressionPath(varExp);
      const value = path[path.length - 1].ref;
      this.returnWithResult(id, value);
    } catch (err) {
      this.returnWithError(id, 'Can not get value of ' + varExp);
    }
  }

  /**
   * Call a method
   * payload: { method: 'location.replace', params: ['/foo.html'] }
   * returns: executed result
   */
  method({ id, method, params }) {
    try {
      const path = resolveMemberExpressionPath(method);
      const scope = path[path.length - 2].ref;
      const value = path[path.length - 1].ref;
      this.returnWithResult(id, value.apply(scope, params));
    } catch (err) {
      this.returnWithError(id, `Can not call ${method} with params ${params}`);
    }
  }

  /**
   * Assign value to some variable
   */
  assign({ id, varExp, value }) {
    try {
      const path = resolveMemberExpressionPath(varExp);
      const scope = path[path.length - 2].ref;
      const { identifier } = path[path.length - 1];
      this.returnWithResult(id, scope[identifier] = value);
    } catch (err) {
      this.returnWithError(id, `Can not assign ${varExp} with params ${value}`);
    }
  }
}

function resolveMemberExpressionPath(exp, scope = global) {
  let i = 0, ref = scope, current = '';
  const path = [{ref, identifier: 'scope'}];
  while (exp[i]) {
    if (exp[i] === '.' || exp[i] === '[') {
      ref = ref[current];
      path.push({ ref, identifier: current });
      current = '';
    } else if (exp[i] === ']' || exp[i] === ' ') {
      // Skip
    } else if (exp[i] === '#') {
      ref = scope;
    } else {
      current += exp[i];
    }
    i++;
  }
  ref = ref[current];
  path.push({ ref, identifier: current });
  return path;
}
