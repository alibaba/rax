import { error } from '../../../miniapp-framework-shared/src/debugger';

const noop = () => {};
let callCount = 0;

/**
 * Methods that listed here means which need persistance callbacks.
 * @type {Array}
 */
const PERSISTANCE_BRIDGE_METHODS = [];

export function call(modKey, params, onSuccess = noop, onFail = noop) {
  const [module, method] = modKey.split('.');

  const callId = ++callCount;
  function callEndHandler(evt) {
    if (
      evt &&
      evt.data &&
      evt.data.type === 'callEnd' &&
      evt.data.callId === callId
    ) {
      if (PERSISTANCE_BRIDGE_METHODS.indexOf(modKey) === -1) {
        removeEventListener('message', callEndHandler);
      }

      const { status, result, err } = evt.data;
      if (status === 'resolved') {
        onSuccess(result);
      } else {
        onFail(err);
      }
    }
  }

  addEventListener('message', callEndHandler);

  postMessage({
    type: 'call',
    module,
    method,
    params,
    callId,
  });
}
