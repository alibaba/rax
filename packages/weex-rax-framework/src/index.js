import {BuiltinModulesFactory} from './builtin';
import EventEmitter from './emitter';

let NativeComponents = {};
let NativeModules = {};

let Document;
let Element;
let Comment;
let Listener;
let sendTasks;

const instances = {};

function dispatchEventToInstance(event, targetOrigin) {
  var instance;
  for (var i in instances) {
    if (instances.hasOwnProperty(i)) {
      instance = instances[i];
      if (targetOrigin === '*' || targetOrigin === instance.origin) {
        event.target = instance.window;
        // FIXME: Need async?
        instance.window.dispatchEvent(event);
      }
    }
  }
}

export function getInstance(instanceId) {
  const instance = instances[instanceId];
  if (!instance) {
    throw new Error(`Invalid instance id "${instanceId}"`);
  }
  return instance;
}

export function init(cfg) {
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
export function registerComponents(components) {
  if (Array.isArray(components)) {
    components.forEach(function register(name) {
      /* istanbul ignore if */
      if (!name) {
        return;
      }
      if (typeof name === 'string') {
        NativeComponents[name] = true;
      } else if (typeof name === 'object' && typeof name.type === 'string') {
        NativeComponents[name.type] = name;
      }
    });
  }
}

/**
 * register the name and methods of each api
 * @param  {object} apis a object of apis
 */
export function registerMethods(apis) {
  if (typeof apis === 'object') {
    // Noop
  }
}

/**
 * register the name and methods of each module
 * @param  {object} modules a object of modules
 */
export function registerModules(newModules) {
  if (typeof newModules === 'object') {
    for (var name in newModules) {
      if (Object.prototype.hasOwnProperty.call(newModules, name)) {
        NativeModules[name] = newModules[name];
      }
    }
  }
}

function genBuiltinModules(
  modules,
  // ES
  Promise,
  // W3C
  window,
  screen,
  document,
  navigator,
  location,
  fetch,
  Headers,
  Response,
  Request,
  URL,
  URLSearchParams,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  requestAnimationFrame,
  cancelAnimationFrame,
  alert,
  // Weex
  __weex_define__,
  __weex_require__,
  __weex_options__,
  __weex_data__,
  __weex_downgrade__,
  __weex_document__
) {
  for (let moduleName in BuiltinModulesFactory) {
    modules[moduleName] = {
      factory: BuiltinModulesFactory[moduleName].bind(
          null,
          // ES
          Promise,
          // W3C
          window,
          screen,
          document,
          navigator,
          location,
          fetch,
          Headers,
          Response,
          Request,
          URL,
          URLSearchParams,
          setTimeout,
          clearTimeout,
          setInterval,
          clearInterval,
          requestAnimationFrame,
          cancelAnimationFrame,
          alert,
          // Weex
          __weex_define__,
          __weex_require__,
          __weex_options__,
          __weex_data__,
          __weex_downgrade__,
          __weex_document__
        ),
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
            finalArgs[index] = normalize(value, getInstance(instanceId));
          });

          sendTasks(String(instanceId), [{
            module: name,
            method: methodName,
            args: finalArgs
          }], '-1');
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
export function createInstance(instanceId, code, options /* {bundleUrl, debug} */, data) {
  const Promise = require('runtime-shared/dist/promise.function')();
  const URL = require('runtime-shared/dist/url.function')();
  const URLSearchParams = require('runtime-shared/dist/url-search-params.function')();

  let instance = instances[instanceId];

  if (instance == undefined) {
    const ENV = typeof WXEnvironment === 'object' && WXEnvironment || {};
    const document = new Document(instanceId, options.bundleUrl, null, Listener);
    const location = new URL(document.URL);

    let modules = {};
    // Generate native modules map at instance init
    genNativeModules(modules, instanceId);

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
        mod.hasError = true;
        mod.isInitialized = false;
        throw e;
      }

      return mod.module.exports;
    }

    const emitter = new EventEmitter();

    const window = {
      devicePixelRatio: ENV.scale,
      open: (url) => {
        const weexNavigator = req('@weex-module/navigator');
        weexNavigator.push({
          url,
          animated: 'true',
        }, function(e) {
          // noop
        });
      },
      postMessage: (message, targetOrigin) => {
        var event = {
          origin: location.origin,
          data: JSON.parse(JSON.stringify(message)),
          type: 'message',
          source: window, // FIXME: maybe not export window
        };
        dispatchEventToInstance(event, targetOrigin);
      },
      addEventListener: (type, listener) => {
        emitter.on(type, listener);
      },
      removeEventListener: (type, listener) => {
        emitter.off(type, listener);
      },
      dispatchEvent: (e) => {
        emitter.emit(e.type, e);
      }
    };

    instance = instances[instanceId] = {
      window,
      document,
      instanceId,
      modules,
      origin: location.origin,
      callbacks: [],
      uid: 0
    };

    // https://www.w3.org/TR/2009/WD-html5-20090423/browsers.html#dom-navigator
    const navigator = {
      product: 'Weex',
      platform: ENV.platform,
      appName: ENV.appName,
      appVersion: ENV.appVersion,
      // weexVersion: ENV.weexVersion,
      // osVersion: ENV.osVersion,
      // userAgent
    };

    // https://drafts.csswg.org/cssom-view/#the-screen-interface
    const screen = {
      width: ENV.deviceWidth,
      height: ENV.deviceHeight,
      availWidth: ENV.deviceWidth,
      availHeight: ENV.deviceHeight,
      colorDepth: 24,
      pixelDepth: 24,
    };

    const timerModuleName = '@weex-module/timer';
    const setTimeout = (...args) => {
      const timer = req(timerModuleName);
      const handler = function() {
        args[0](...args.slice(2));
      };
      timer.setTimeout(handler, args[1]);
      return instance.uid.toString();
    };

    const setInterval = (...args) => {
      const timer = req(timerModuleName);
      const handler = function() {
        args[0](...args.slice(2));
      };
      timer.setInterval(handler, args[1]);
      return instance.uid.toString();
    };

    const clearTimeout = (n) => {
      const timer = req(timerModuleName);
      timer.clearTimeout(n);
    };

    const clearInterval = (n) => {
      const timer = req(timerModuleName);
      timer.clearInterval(n);
    };

    const requestAnimationFrame = (callback) => {
      const timer = req(timerModuleName);
      timer.setTimeout(callback, 16);
      return instance.uid.toString();
    };

    const cancelAnimationFrame = (n) => {
      const timer = req(timerModuleName);
      timer.clearTimeout(n);
    };

    const alert = (message) => {
      const modal = req('@weex-module/modal');
      modal.alert({
        message
      }, function() {});
    };

    const downgrade = require('./downgrade.weex')(req);
    const fetch = require('./fetch.weex')(req, Promise);
    const {Headers, Request, Response} = fetch;

    let globals = [
      // ES
      Promise,
      // W3C
      window,
      screen,
      document,
      navigator,
      location,
      fetch,
      Headers,
      Response,
      Request,
      URL,
      URLSearchParams,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      requestAnimationFrame,
      cancelAnimationFrame,
      alert,
      // Weex
      def,
      req,
      options,
      data,
      downgrade,
      document
    ];

    genBuiltinModules(
      modules,
      // ES
      Promise,
      // W3C
      window,
      screen,
      document,
      navigator,
      location,
      fetch,
      Headers,
      Response,
      Request,
      URL,
      URLSearchParams,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      requestAnimationFrame,
      cancelAnimationFrame,
      alert,
      // Weex
      def,
      req,
      options,
      data,
      downgrade,
      document
    );

    if (ENV.platform !== 'Web') {
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
        // Weex
        '__weex_define__',
        '__weex_require__',
        '__weex_options__',
        '__weex_data__',
        '__weex_downgrade__',
        '__weex_document__',
        // ModuleJS
        'define',
        'require',
        '"use strict";' + code
      );

      init.call(
        // Context is window
        window,
        // ES
        Promise,
        // W3C
        window,
        screen,
        document,
        navigator,
        location,
        fetch,
        Headers,
        Response,
        Request,
        URL,
        URLSearchParams,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        requestAnimationFrame,
        cancelAnimationFrame,
        alert,
        // Weex
        def,
        req,
        options,
        data,
        downgrade,
        document,
        // ModuleJS
        def,
        req,
      );
    } else {
      let init = new Function(
        '"use strict";' + code
      );

      init.call(
        window
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
export function refreshInstance(instanceId, data) {
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
export function destroyInstance(instanceId) {
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
export function getRoot(instanceId) {
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
export function receiveTasks(instanceId, tasks) {
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

function normalize(v, instance) {
  const type = typof(v);

  switch (type) {
    case 'undefined':
    case 'null':
      return '';
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

function typof(v) {
  const s = Object.prototype.toString.call(v);
  return s.substring(8, s.length - 1).toLowerCase();
}

export default {
  createInstance,
  destroyInstance,
  getInstance,
  getRoot,
  init,
  receiveTasks,
  refreshInstance,
  registerComponents,
  registerMethods,
  registerModules
};
