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
   * returns: { value }
   */
  query({ key, processId }) {
    try {
      let i = 0, ref = global, current = '';
      while (key[i]) {
        if (key[i] === '.' || key[i] === '[') {
          ref = ref[current];
          current = '';
        } else if (key[i] === ']' || key[i] === ' ') {
          // Skip
        } else {
          current += key[i];
        }
        i++;
      }
      this.resolve(processId, { value: ref[current] });
    } catch(err) {
      this.reject(processId, 'Can not read value of ' + key);
    }
  }
}
