import splice from '../shared/splice';
import setImmediate from '../shared/setImmediate';

let observers = [];
let pendingMutations = false;

export function mutate(target, type, record) {
  record.target = target;
  record.type = type;

  for (let i = observers.length; i--;) {
    let _target = target;
    let ob = observers[i],
      match = _target === ob._target;
    if (!match && ob._options.subtree) {
      do {
        if (match = _target === ob._target) break;
      } while (_target = _target.parentNode);
    }

    if (match) {
      ob._records.push(record);
      if (!pendingMutations) {
        pendingMutations = true;
        setImmediate(flushMutations, 0);
      }
    }
  }
}

export function flushMutations() {
  pendingMutations = false;
  for (let i = observers.length; i--;) {
    let ob = observers[i];
    if (ob._records.length) {
      ob.callback(ob.takeRecords());
    }
  }
}

export default class MutationObserver {
  constructor(callback) {
    this.callback = callback;
    this._records = [];
  }
  observe(target, options) {
    this.disconnect();
    this._target = target;
    this._options = options || {};
    observers.push(this);
  }
  disconnect() {
    this._target = null;
    splice(observers, this);
  }
  takeRecords() {
    return this._records.splice(0, this._records.length);
  }
}
