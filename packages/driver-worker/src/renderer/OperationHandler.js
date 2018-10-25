import global from '../../shared/global';

export default class OperationHandler {
  constructor(sender) {
    this.sender = sender;
  }

  apply({ data }) {
    const { type } = data;
    this[type](data);
  }

  returnSuccess(id, success) {
    this.send({ type: 'success', id, success });
  }

  returnError(id, error) {
    this.send({ type: 'error', id, error });
  }

  send(data) {
    this.sender && this.sender({
      type: 'return',
      data,
    });
  }

  /**
   * Get a global variable's val.
   * payload: { varExp: 'location.href[0]' }
   * returns: value
   */
  get({ id, varExp }) {
    try {
      const path = resolveMemberExpressionPath(varExp);
      const value = path[path.length - 1].ref;
      this.returnSuccess(id, value);
    } catch (err) {
      this.returnError(id, 'Can not get value of ' + varExp);
    }
  }

  /**
   * Assign value to some variable.
   */
  set({ id, varExp, value }) {
    try {
      const path = resolveMemberExpressionPath(varExp);
      const scope = path[path.length - 2].ref;
      const { identifier } = path[path.length - 1];
      this.returnSuccess(id, scope[identifier] = value);
    } catch (err) {
      this.returnError(id, `Can not assign ${varExp} with params ${value}`);
    }
  }

  /**
   * Delete value.
   */
  delete({ id, varExp }) {
    try {
      const path = resolveMemberExpressionPath(varExp);
      const scope = path[path.length - 2].ref;
      const { identifier } = path[path.length - 1];
      delete scope[identifier];
      this.returnSuccess(id, true);
    } catch (err) {
      this.returnError(id, `Can not delete ${varExp}.`);
    }
  }

  /**
   * Call a method.
   * payload: { method: 'location.replace', params: ['/foo.html'] }
   * returns: executed result
   */
  call({ id, method, params }) {
    try {
      const path = resolveMemberExpressionPath(method);
      const scope = path[path.length - 2].ref;
      const value = path[path.length - 1].ref;
      this.returnSuccess(id, value.apply(scope, params));
    } catch (err) {
      this.returnError(id, `Can not call ${method} with params ${params}`);
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
