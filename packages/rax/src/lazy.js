import { LAZY_TYPE } from './constant';

const Uninitialized = -1;
const Pending = 0;
const Resolved = 1;
const Rejected = 2;

function lazyInitializer(payload) {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
    const thenable = ctor(); // Transition to the next state.

    const pending = payload;
    pending._status = Pending;
    pending._result = thenable;
    thenable.then((moduleObject) => {
      if (payload._status === Pending) {
        const defaultExport = moduleObject.default;
        const resolved = payload;
        resolved._status = Resolved;
        resolved._result = defaultExport;
      }
    }, (error) => {
      if (payload._status === Pending) {
        // Transition to the next state.
        const rejected = payload;
        rejected._status = Rejected;
        rejected._result = error;
      }
    });
  }

  if (payload._status === Resolved) {
    return payload._result;
  } else {
    throw payload._result;
  }
}

export default function lazy(ctor) {
  var payload = {
    _status: -1,
    _result: ctor
  };

  var lazyType = {
    $$typeof: LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer
  };

  return lazyType;
}