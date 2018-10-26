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
      this.returnSuccess(id, eval(varExp));
    } catch (err) {
      this.returnError(id, 'Can not get value of ' + varExp);
    }
  }

  /**
   * Assign value to some variable.
   */
  set({ id, varExp, value }) {
    try {
      // Pass the real JSVal to variable.
      (new Function('v', `${varExp} = v`))(value);
      this.returnSuccess(id, value);
    } catch (err) {
      this.returnError(id, `Can not assign ${varExp} with params ${value}`);
    }
  }

  /**
   * Delete value.
   */
  delete({ id, varExp }) {
    try {
      eval(`delete ${varExp}`);
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
      const success = (new Function('p', `return ${method}.apply(${scope}, p)`))(params);
      const scope = getScopeOfVarExp(method);
      this.returnSuccess(id, success);
    } catch (err) {
      this.returnError(id, `Can not call ${method} with params ${params}`);
    }
  }
}

function getScopeOfVarExp(exp, scope = global) {
  let i = 0, ref = scope, current = '';
  while (exp[i]) {
    if (exp[i] === '.' || exp[i] === '[') {
      ref = ref[current];
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
  return ref;
}
