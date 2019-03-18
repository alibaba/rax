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

      const { result, error } = evt.data;
      if (error) {
        onFail(error);
      } else {
        onSuccess(result);
      }
    }
  }

  addEventListener('message', callEndHandler);

  postMessage({
    target: 'AppContainer',
    payload: {
      type: 'call',
      module,
      method,
      params,
      callId,
    },
  });
}
