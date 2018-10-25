import global from '../../shared/global';

export default class RemoteESSyncHandler {
  costructor(sender) {
    this.sender = sender;
  }

  apply(data) {
    const { type } = data;
    this[type](data);
  }

  resolve(processId, result) {
    this.sender({ processId, result });
  }

  reject(processId, errorMessage) {
    this.sender({ processId, error: errorMessage });
  }

  /**
   * Query a global variable's val
   * payload: { key: 'location.href[0]' }
   * returns: value
   */
  query({ key, processId }) {
    try {
      const { value } = this.resolveMemberExpression(method);
      this.resolve(processId, value);
    } catch (err) {
      this.reject(processId, 'Can not read value of ' + key);
    }
  }

  /**
   * Call a method
   * payload: { method: 'location.replace', args: ['/foo.html'] }
   * returns: executed result
   */
  call({ processId, method, args }) {
    try {
      const { scope, value } = this.resolveMemberExpression(method);
      this.resolve(processId, value.apply(scope, args));
    } catch (err) {
      this.reject(processId, 'Can not call ' + expression);
    }
  }

  assign({ processid, key, value }) {
    // todo
  }

  /**
   * Execute a procedure
   * payload: {
   *   procedures: [
   *     { type: 'call', method: 'document.createElement', args: ['div'], as: '#container' },
   *     { type: 'call', method: 'document.createElement', args: ['span'], as: '#child' },
   *     { type: 'assign', key: '#child.innerHTML', value: 'hello world' },
   *     { type: 'call', '#container.appendChild', args: ['#child'] },
   *   ]
   * }
   * returns: executed result
   */
  procedure({ processId, }) {
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
