const lifecycles = {
  // [clientId]: {
  //   [eventName]
  // }
};

export function emit(evtName, clientId, payload) {
  if (lifecycles[clientId] && Array.isArray(lifecycles[clientId][evtName])) {
    lifecycles[clientId][evtName].forEach(callback => callback(payload));
  }
}

export function on(evtName, callback) {
  if (this._context) {
    const { clientId } = this._context;
    lifecycles[clientId] = lifecycles[clientId] || {};
    const cycles = lifecycles[clientId][evtName] =
      lifecycles[clientId][evtName] || [];
    cycles.push(callback);
  }
}

export function off(evtName, callback) {
  if (this._context) {
    const { clientId } = this._context;
    lifecycles[clientId] = lifecycles[clientId] || {};
    const cycles = lifecycles[clientId][evtName] =
      lifecycles[clientId][evtName] || [];
    let idx = -1;
    for (let i = 0, l = cycles.length; i < l; i++) {
      if (callback === cycles[i]) {
        idx = i;
        break;
      }
    }
    if (idx > -1) {
      cycles.splice(idx, 1);
    }
  }
}
