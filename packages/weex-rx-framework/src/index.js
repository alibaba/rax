import Promise from './promise';
import URL from './URL';
import URLSearchParams from './URLSearchParams';
import downgrade from './downgrade';
import Fetch from './fetch';

let BuiltinModules = {
  core: require('universal-rx/dist/rx'),
  env: require('universal-env/dist/env'),
};

let NativeComponents = {};
let NativeModules = {};

let Document;
let Element;
let Comment;
let Listener;
let sendTasks;

const instances = {};
const noop = function(){};

export function getInstance(instanceId) {
  const instance = instances[instanceId];
  if (!instance) {
    throw new Error(`Invalid instance id "${instanceId}"`);
  }
  return instance;
}

export function init (cfg) {
  Document = cfg.Document;
  Element = cfg.Element;
  Comment = cfg.Comment;
  Listener = cfg.Listener;
  sendTasks = cfg.sendTasks;
}

/**
 * register the name of each native component
 * @param  {array} components array of name
 */
export function registerComponents (components) {
  if (Array.isArray(components)) {
    components.forEach(function register (name) {
      /* istanbul ignore if */
      if (!name) {
        return;
      }
      if (typeof name === 'string') {
        NativeComponents[name] = true;
      }
      else if (typeof name === 'object' && typeof name.type === 'string') {
        NativeComponents[name.type] = name;
      }
    });
  }
}

/**
 * register the name and methods of each api
 * @param  {object} apis a object of apis
 */
export function registerMethods (apis) {
  if (typeof apis === 'object') {
    // Noop
  }
}

/**
 * register the name and methods of each module
 * @param  {object} modules a object of modules
 */
export function registerModules (newModules) {
  if (typeof newModules === 'object') {
    for (var name in newModules) {
      if (Object.prototype.hasOwnProperty.call(newModules, name)) {
        NativeModules[name] = newModules[name];
      }
    }
  }
}

function genBuiltinModules() {
  let modules = {};
  const prefix = '@rx/';
  for (let name in BuiltinModules) {
    let moduleName = prefix + name;
    modules[moduleName] = {
      module: {exports: BuiltinModules[name]},
      isInitialized: true,
    };
  }
  return modules;
}

function genNativeModules(instanceId) {
  const prefix = '@weex-module/';
  let modules = {};

  if (typeof NativeModules === 'object') {
    for (let name in NativeModules) {
      let moduleName = prefix + name;
      modules[moduleName] = {
        module: {exports: {}},
        isInitialized: true,
      };

      NativeModules[name].forEach(method => {

        if (typeof method === 'string') {
          method = {
            name: method
          };
        }

        let methodName = method.name;

        modules[moduleName].module.exports[methodName] = (...args) => {
          const finalArgs = [];
          args.forEach((arg, index) => {
            const value = args[index];
            finalArgs[index] = normalize(value, getInstance(instanceId))
          });

          sendTasks(String(instanceId), [{
            module: name,
            method: methodName,
            args: finalArgs
          }]);
        };

      });
    }
  }

  return modules;
}


/**
 * create a Weex instance
 *
 * @param  {string} instanceId
 * @param  {string} code
 * @param  {object} [options] option `HAS_LOG` enable print log
 * @param  {object} [data]
 */
export function createInstance (instanceId, code, options /* {bundleUrl, debug} */, data) {
  let instance = instances[instanceId];

  if (instance == undefined) {
    let document = new Document(instanceId, options.bundleUrl, null, Listener);
    let location = new URL(document.URL || '');
    let modules = Object.assign(
      genBuiltinModules(),
      genNativeModules(instanceId)
    );

    instance = instances[instanceId] = {
      document,
      instanceId,
      modules,
      callbacks: [],
      uid: 0
    };

    function def(id, deps, factory) {

      if (deps instanceof Function) {
        factory = deps;
        deps = [];
      }

      modules[id] = {
        factory: factory,
        deps: deps,
        module: {exports: {}},
        isInitialized: false,
        hasError: false,
      };
    }

    function req(id) {

      var mod = modules[id];

      if (mod && mod.isInitialized) {
        return mod.module.exports;
      }

      if (!mod) {
        throw new Error(
          'Requiring unknown module "' + id + '"'
        );
      }

      if (mod.hasError) {
        throw new Error(
          'Requiring module "' + id + '" which threw an exception'
        );
      }

      try {
        mod.isInitialized = true;
        mod.factory(req, mod.module.exports, mod.module);

      } catch (e) {
        mod.hasError = true
        mod.isInitialized = false
        throw e;
      }

      return mod.module.exports;
    }

    let timerAPIs;
    let dialogAPIs;
    let downgradeAPIs;
    let asyncStorageAPIs;
    let networkAPIs;

    if (typeof WXEnvironment === 'object' && WXEnvironment.platform !== 'Web') {

      const timer = req('@weex-module/timer');
      timerAPIs = {
        setTimeout: (...args) => {
          const handler = function () {
            args[0](...args.slice(2))
          }
          timer.setTimeout(handler, args[1])
          return instance.uid.toString()
        },
        setInterval: (...args) => {
          const handler = function () {
            args[0](...args.slice(2))
          }
          timer.setInterval(handler, args[1])
          return instance.uid.toString()
        },
        clearTimeout: (n) => {
          timer.clearTimeout(n)
        },
        clearInterval: (n) => {
          timer.clearInterval(n)
        }
      };

      const toast = req('@weex-module/toast')
      dialogAPIs = {
        alert: (message) => {
          toast.alert({
            message
          }, function() {})
        }
      };

      const instanceWrap = req('@weex-module/instanceWrap');
      downgradeAPIs = {
        setting: downgrade.setting.bind(null, instanceWrap);
      };

      const stream = require('@weex-module/stream');
      networkAPIs = {
        fetch: Fetch.bind(null, stream.fetch);
      };

      asyncStorageAPIs = req('@weex-module/storage');

    } else {
      // TODO
    }

    let init = new Function(
      'Promise',
      'URL',
      'URLSearchParams',
      'define',
      'require',
      '__d',
      '__r',
      '__DEV__',
      '__weex_options__',
      '__weex_data__',
      '__weex_document__',
      'document',
      'alert',
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'location',
      'fetch',
      'asyncStorage',
      'downgrade',
      '"use strict";' + code
    );

    init(
      Promise,
      URL,
      URLSearchParams,
      def,
      req,
      def,
      req,
      options.debug,
      options,
      data,
      document,
      document,
      dialogAPIs.alert,
      timerAPIs.setTimeout,
      timerAPIs.clearTimeout,
      timerAPIs.setInterval,
      timerAPIs.clearInterval,
      location,
      networkAPIs.fetch,
      asyncStorageAPIs,
      downgradeAPIs
    );
  } else {
    throw new Error(`Instance id "${instanceId}" existed when create instance`);
  }

}

/**
 * refresh a Weex instance
 *
 * @param  {string} instanceId
 * @param  {object} data
 */
export function refreshInstance (instanceId, data) {
  let instance = getInstance(instanceId);
  let document = instance.document;
  document.documentElement.fireEvent('refresh', {
    timestamp: Date.now(),
    data,
  });
  document.listener.refreshFinish();
}

/**
 * destroy a Weex instance
 * @param  {string} instanceId
 */
export function destroyInstance (instanceId) {
  let instance = getInstance(instanceId);
  let document = instance.document;
  document.documentElement.fireEvent('destory', {
    timestamp: Date.now()
  });

  if (document.destroy) {
    document.destroy();
  }

  delete instances[instanceId];
}

/**
 * get a whole element tree of an instance
 * for debugging
 * @param  {string} instanceId
 * @return {object} a virtual dom tree
 */
export function getRoot (instanceId) {
  let instance = getInstance(instanceId);
  let document = instance.document;
  return document.toJSON ? document.toJSON() : {};
}

function fireEvent(doc, ref, type, e, domChanges) {
  if (Array.isArray(ref)) {
    ref.some((ref) => {
      return fireEvent(doc, ref, type, e) !== false;
    });
    return;
  }

  const el = doc.getRef(ref);

  if (el) {
    const result = doc.fireEvent(el, type, e, domChanges);
    doc.listener.updateFinish();
    return result;
  }

  return new Error(`Invalid element reference "${ref}"`);
}

function handleCallback(doc, callbacks, callbackId, data, ifKeepAlive) {

  let callback = callbacks[callbackId];
  if (typeof callback === 'function') {
    callback(data);
    if (typeof ifKeepAlive === 'undefined' || ifKeepAlive === false) {
      callbacks[callbackId] = null;
    }
    doc.listener.updateFinish();
    return;
  }

  return new Error(`Invalid callback id "${callbackId}"`)
}

/**
 * accept calls from native (event or callback)
 *
 * @param  {string} instanceId
 * @param  {array} tasks list with `method` and `args`
 */
export function receiveTasks (instanceId, tasks) {
  const instance = getInstance(instanceId);
  if (Array.isArray(tasks)) {
    const { callbacks, document } = instance;
    const results = [];
    tasks.forEach(task => {
      let result;
      if (task.method === 'fireEvent') {
        let [nodeId, type, data, domChanges] = task.args;
        result = fireEvent(document, nodeId, type, data, domChanges);
      } else if (task.method === 'callback') {
        let [uid, data, ifKeepAlive] = task.args;
        result = handleCallback(document, callbacks, uid, data, ifKeepAlive);
      }
      results.push(result);
    });
    return results;
  }
}

export default function normalize (v, instance) {
  const type = typof(v)

  switch (type) {
    case 'undefined':
    case 'null':
      return ''
    case 'regexp':
      return v.toString()
    case 'date':
      return v.toISOString()
    case 'number':
    case 'string':
    case 'boolean':
    case 'array':
    case 'object':
      if (v instanceof Element) {
        return v.ref
      }
      return v
    case 'function':
      instance.callbacks[++instance.uid] = v
      return instance.uid.toString()
    default:
      return JSON.stringify(v)
  }
}

function typof (v) {
  const s = Object.prototype.toString.call(v)
  return s.substring(8, s.length - 1).toLowerCase()
}
