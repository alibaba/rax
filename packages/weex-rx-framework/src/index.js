import Promise from './promise';
import URL from './URL';
import URLSearchParams from './URLSearchParams';
import downgrade from './downgrade';
import Fetch, {Headers, Request, Response} from './fetch';
import navigator from './navigator';

let BuiltinModulesFactory = {
  rx: require('universal-rx/dist/rx.factory'),
  env: require('universal-env/dist/env.factory'),
  transition: require('universal-transition/dist/transition.factory'),
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

function genBuiltinModules(modules, document) {
  const prefix = '@universal/';
  for (let key in BuiltinModulesFactory) {
    let moduleName = prefix + key;
    modules[moduleName] = {
      factory: (BuiltinModulesFactory[key]).bind(null, document),
      module: {exports: {}},
      isInitialized: false,
    };
  }
  return modules;
}

function genNativeModules(modules, instanceId) {
  const prefix = '@weex-module/';

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
    const document = new Document(instanceId, options.bundleUrl, null, Listener);
    const location = new URL(document.URL || '');
    let modules = {};
    genNativeModules(modules, instanceId);
    genBuiltinModules(modules, document);

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

    if (typeof WXEnvironment === 'object' && WXEnvironment.platform !== 'Web') {

      // https://drafts.csswg.org/cssom-view/#the-screen-interface
      const screenAPIs = {
        width: WXEnvironment.deviceWidth,
        height: WXEnvironment.deviceHeight,
        availWidth: WXEnvironment.deviceWidth,
        availHeight: WXEnvironment.deviceHeight,
        colorDepth: 24,
        pixelDepth: 24,
      };

      const weexNavigator = req('@weex-module/navigator');
      const windowAPIs = {
        devicePixelRatio: WXEnvironment.scale,
        open: (url) => {
          weexNavigator.push({
            url,
            animated : 'true',
          }, function(e) {
            // noop
          });
        },
        addEventListener: (type, listener) => {
          // TODO
        },
        removeEventListener: (type, listener) => {
          // TODO
        }
      };

      const timer = req('@weex-module/timer');
      const timerAPIs = {
        setTimeout: (...args) => {
          const handler = function () {
            args[0](...args.slice(2));
          };
          timer.setTimeout(handler, args[1]);
          return instance.uid.toString();
        },
        setInterval: (...args) => {
          const handler = function () {
            args[0](...args.slice(2));
          };
          timer.setInterval(handler, args[1]);
          return instance.uid.toString();
        },
        clearTimeout: (n) => {
          timer.clearTimeout(n);
        },
        clearInterval: (n) => {
          timer.clearInterval(n);
        },
        requestAnimationFrame: (callback) => {
          timer.setTimeout(callback, 16);
          return instance.uid.toString();
        },
        cancelAnimationFrame: (n) => {
          timer.clearTimeout(n);
        }
      };

      const modal = req('@weex-module/modal')
      const dialogAPIs = {
        alert: (message) => {
          modal.alert({
            message
          }, function() {})
        }
      };

      const instanceWrap = req('@weex-module/instanceWrap');
      const downgradeAPIs = {
        downgrade: downgrade.bind(null, instanceWrap),
      };

      const stream = req('@weex-module/stream');
      const networkAPIs = {
        fetch: Fetch.bind(null, stream.fetch),
      };

      let init = new Function(
        // ES
        'Promise',
        // W3C
        'window',
        'screen',
        'document',
        'navigator',
        'location',
        'fetch',
        'Headers',
        'Response',
        'Request',
        'URL',
        'URLSearchParams',
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'alert',
        // ModuleJS
        'define',
        'require',
        // Weex
        '__weex_define__',
        '__weex_require__',
        '__weex_options__',
        '__weex_data__',
        '__weex_downgrade__',
        '"use strict";' + code
      );

      init(
        // ES
        Promise,
        // W3C
        windowAPIs,
        screenAPIs,
        document,
        navigator,
        location,
        networkAPIs.fetch,
        Headers,
        Response,
        Request,
        URL,
        URLSearchParams,
        timerAPIs.setTimeout,
        timerAPIs.clearTimeout,
        timerAPIs.setInterval,
        timerAPIs.clearInterval,
        timerAPIs.requestAnimationFrame,
        timerAPIs.cancelAnimationFrame,
        dialogAPIs.alert,
        // ModuleJS
        def,
        req,
        // Weex
        def,
        req,
        options,
        data,
        downgradeAPIs.downgrade
      );

    } else {
      let init = new Function(
        'document',
        '"use strict";' + code
      );

      init(
        document
      );
    }

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

  return new Error(`Invalid callback id "${callbackId}"`);
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
  const type = typof(v);

  switch (type) {
    case 'undefined':
    case 'null':
      return ''
    case 'regexp':
      return v.toString();
    case 'date':
      return v.toISOString();
    case 'number':
    case 'string':
    case 'boolean':
    case 'array':
    case 'object':
      if (v instanceof Element) {
        return v.ref;
      }
      return v;
    case 'function':
      instance.callbacks[++instance.uid] = v;
      return instance.uid.toString();
    default:
      return JSON.stringify(v);
  }
}

function typof (v) {
  const s = Object.prototype.toString.call(v);
  return s.substring(8, s.length - 1).toLowerCase();
}
