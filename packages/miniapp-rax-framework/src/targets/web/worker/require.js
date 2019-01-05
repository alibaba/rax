import { error } from '../../../core/debugger';
import app from './modules/app';
import page from './modules/page';
import { adapterComponent } from 'sfc-runtime';
import Console from '../../../core/console';
import decycle from '../../../core/decycle';

const PERSISTANCE_BRIDGE_METHODS = [
  'device.onShake',
  'webSocket.onOpen',
  'webSocket.onMessage',
  'webSocket.onClose',
  'webSocket.onError',
  'connection.onChange',
  'broadcast.onMessage',
];

let callCount = 0;
function noop() {}
function $call(modKey, params, onSuccess = noop, onFail = noop) {
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
        error(
          `failed to exec ${module}.${method}(${JSON.stringify(
            params,
            null,
            2
          )})`
        );
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

function getSchemaData(successCallback = noop, errorCallback = noop) {
  $call(
    'memoryStorage.getItem',
    {
      key: 'schemaData',
    },
    successCallback,
    errorCallback
  );
}

const consoleCache = {};
function createOrFindConsole(clientId) {
  return (
    consoleCache[clientId] ||
    (consoleCache[clientId] = new Console({
      sender: function sender(type, args = []) {
        let payload = {};
        if (type === '$switch') {
          payload = {
            type: 'switch',
            value: args,
          };
        } else {
          payload = {
            type,
            args: args.map(arg => decycle(arg)),
          };
        }
        postMessage({
          type: 'console',
          clientId,
          payload,
        });
      },
    }))
  );
}

const VALID_MOD_REG = /^@core\//;
/**
 * 用户的 require 函数
 */
export default function moduleRequire(mod) {
  if (!VALID_MOD_REG.test(mod)) {
    throw new Error(
      `unknown module ${mod}, only core modules allowed!`
    );
  }
  switch (mod) {
    case '@core/runtime':
      // for sfc-loader using commonjs2
      return { default: adapterComponent };

    case '@core/rax':
      if (this) {
        return this.rax;
      } else {
        return {};
      }

    case '@core/app':
      return app;

    case '@core/page':
      if (this) {
        return {
          ...page,
          _context: this,
        };
      } else {
        return page;
      }

    case '@core/console':
      if (this && this.clientId) {
        return createOrFindConsole(this.clientId);
      } else {
        return console;
      }

    case '@core/getSchemaData':
      return getSchemaData;

    default:
      return $call;
  }
}
