import { worker } from 'miniapp-framework-shared';

const registerPage = worker.pageHub.register;
const lifecycles = {
  // [clientId]: {
  //   [eventName]
  // }
};

export function $emit(evtName, clientId, payload) {
  if (lifecycles[clientId] && Array.isArray(lifecycles[clientId][evtName])) {
    lifecycles[clientId][evtName].forEach(callback => callback(payload));
  }
}

export default {
  on(evtName, callback) {
    if (this._context) {
      const { clientId } = this._context;
      lifecycles[clientId] = lifecycles[clientId] || {};
      const cycles = lifecycles[clientId][evtName] =
        lifecycles[clientId][evtName] || [];
      cycles.push(callback);
    }
  },
  off(evtName, callback) {
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
  },
  register: registerPage,
};
