import { log, error } from 'core/debugger';
import { windmillReady } from './windmill-store';
import getContextObject from './utils/getContextObject';
import { app, createPageModule, pageRegisterModule } from './modules';
import { adapterComponent } from 'sfc-runtime';
import Console from 'core/console';
import decycle from 'core/decycle';

const MODULE_PREFIX = '@core/';
const ctx = getContextObject();
// for windmill-module-api to get require fn
// need wma to refactor to not dep this;
ctx.require = contextRequire;

function passthrough(params) {
  return params;
}
function noop() { }

/**
 * getSchemaData
 * @param {*} schema
 * @param {*} successCallback
 * @param {*} errorCallback
 */
function getSchemaData(successCallback = noop, errorCallback = noop) {
  windmillReady((windmill) => {
    windmill.$call('memoryStorage.getItem', {
      key: 'schemaData'
    }, successCallback, errorCallback);
  });
}

const consoleCache = {};
function createOrFindConsole(clientId) {
  return consoleCache[clientId] || (consoleCache[clientId] = new Console({
    sender: function sender(type, args = []) {
      let payload = {};
      if (type === '$switch') {
        payload = {
          type: 'switch',
          value: args
        };
      } else {
        payload = {
          type,
          args: args.map((arg) => decycle(arg)),
        };
      }
      windmillReady((wml) => {
        wml.$emit('console', { type: 'console', clientId, payload }, clientId);
      });
    }
  }));
}

const VALID_MOD_REG = /^@core\//;
/**
 *
 * @param {String} mod 模块名
 */
function contextRequire(mod) {
  log(`requiring mod ${mod}`);
  if (!VALID_MOD_REG.test(mod)) {
    error('unknown module, only core modules allowed!' + mod);
    return null;
  }

  switch (mod) {
    case '@core/runtime':
      // for sfc-loader using commonjs2
      return { default: adapterComponent };

    case '@core/app':
      return app;

    case '@core/page':
      if (this && this.clientId) {
        return createPageModule(this.clientId);
      } else {
        return pageRegisterModule;
      }

    case '@core/rax':
      if (this && this.rax) {
        return this.rax;
      } else {
        error('@core/rax not exists');
        return {};
      }

    /**
     * for template app to get schema data
     */
    case '@core/getSchemaData':
      return getSchemaData;

    /**
     * raw call windmill
     */
    case '@core/call': {
      return ctx.__WINDMILL_MODULE_GETTER__('').call;
    }

    case '@core/console':
      if (this && this.clientId) {
        return createOrFindConsole(this.clientId);
      } else {
        return console;
      }

    /**
     * white list controled by native
     */
    default:
      const module = mod.slice(MODULE_PREFIX.length);
      return ctx.__WINDMILL_MODULE_GETTER__(module);
  }
}

export default contextRequire;
