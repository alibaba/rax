'use strict';

import {ModuleFactories} from './builtin';
import EventEmitter from './emitter';

let NativeComponents = {};
let NativeModules = {};

let Document;
let Element;
let Comment;
let Listener;
let TaskCenter;
let CallbackManager;
let sendTasks;

const MODULE_NAME_PREFIX = '@weex-module/';
const MODAL_MODULE = MODULE_NAME_PREFIX + 'modal';
const DOM_MODULE = MODULE_NAME_PREFIX + 'dom';
const NAVIGATOR_MODULE = MODULE_NAME_PREFIX + 'navigator';
// Instance hub
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

export function init(config) {
  Document = config.Document;
  Element = config.Element;
  Comment = config.Comment;
  Listener = config.Listener;
  TaskCenter = config.TaskCenter;
  CallbackManager = config.CallbackManager;
  sendTasks = config.sendTasks;
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
  // Noop
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

function genBuiltinModules(modules, moduleFactories, context) {
  for (let moduleName in moduleFactories) {
    modules[moduleName] = {
      factory: moduleFactories[moduleName].bind(context),
      module: {exports: {}},
      isInitialized: false,
    };
  }
  return modules;
}

function genNativeModules(modules, instanceId) {
  if (typeof NativeModules === 'object') {
    for (let name in NativeModules) {
      let moduleName = MODULE_NAME_PREFIX + name;
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
 * @param  {string} __weex_code__
 * @param  {object} [__weex_options__] {bundleUrl, debug}
 */
export function createInstance(instanceId, __weex_code__, __weex_options__, __weex_data__, __weex_config__) {
  let instance = instances[instanceId];

  if (instance == undefined) {
    const __weex_env__ = typeof WXEnvironment === 'object' && WXEnvironment || {};

    const Promise = require('runtime-shared/dist/promise.function')();
    const URL = require('runtime-shared/dist/url.function')();
    const URLSearchParams = require('runtime-shared/dist/url-search-params.function')();
    const FontFace = require('runtime-shared/dist/fontface.function')();

    const document = new Document(instanceId, __weex_options__.bundleUrl, null, Listener);
    const location = new URL(document.URL);
    const modules = {};

    instance = instances[instanceId] = {
      document,
      instanceId,
      modules,
      origin: location.origin,
      callbacks: [],
      uid: 0
    };

    // Generate native modules map at instance init
    genNativeModules(modules, instanceId);
    const __weex_define__ = require('./define.weex')(modules);
    const __weex_require__ = require('./require.weex')(modules);
    const __weex_downgrade__ = require('./downgrade.weex')(__weex_require__);
    // FontFace
    document.fonts = {
      add: function(fontFace) {
        var domModule = __weex_require__(DOM_MODULE);
        domModule.addRule('fontFace', {
          fontFamily: fontFace.family,
          src: fontFace.source
        });
      }
    };

    const {
      fetch,
      Headers,
      Request,
      Response
    } = require('./fetch.weex')(__weex_require__, Promise);

    const {
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      requestAnimationFrame,
      cancelAnimationFrame
    } = require('./timer.weex')(__weex_require__, instance);

    const windowEmitter = new EventEmitter();
    const window = {
      // ES
      Promise,
      // W3C
      document,
      location,
      // https://www.w3.org/TR/2009/WD-html5-20090423/browsers.html#dom-navigator
      navigator: {
        product: 'Weex',
        platform: __weex_env__.platform,
        appName: __weex_env__.appName,
        appVersion: __weex_env__.appVersion,
        // weexVersion: __weex_env__.weexVersion,
        // osVersion: __weex_env__.osVersion,
        // userAgent
      },
      // https://drafts.csswg.org/cssom-view/#the-screen-interface
      screen: {
        width: __weex_env__.deviceWidth,
        height: __weex_env__.deviceHeight,
        availWidth: __weex_env__.deviceWidth,
        availHeight: __weex_env__.deviceHeight,
        colorDepth: 24,
        pixelDepth: 24,
      },
      devicePixelRatio: __weex_env__.scale,
      fetch,
      Headers,
      Response,
      Request,
      URL,
      URLSearchParams,
      FontFace,
      setTimeout,
      clearTimeout,
      setInterval,
      clearInterval,
      requestAnimationFrame,
      cancelAnimationFrame,
      alert: (message) => {
        const modal = __weex_require__(MODAL_MODULE);
        modal.alert({
          message
        }, function() {});
      },
      open: (url) => {
        const weexNavigator = __weex_require__(NAVIGATOR_MODULE);
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
        windowEmitter.on(type, listener);
      },
      removeEventListener: (type, listener) => {
        windowEmitter.off(type, listener);
      },
      dispatchEvent: (e) => {
        windowEmitter.emit(e.type, e);
      },
      // ModuleJS
      define: __weex_define__,
      require: __weex_require__,
      // Weex
      __weex_document__: document,
      __weex_define__,
      __weex_require__,
      __weex_downgrade__,
      __weex_env__,
      __weex_code__,
      __weex_options__,
      __weex_data__
    };

    instance.window = window.self = window.window = window;

    let builtinGlobals = {};
    let builtinModules = {};
    try {
      builtinGlobals = __weex_config__.services.builtinGlobals;
      // Modules should wrap as module factory format
      builtinModules = __weex_config__.services.builtinModules;
    } catch (e) {}

    Object.assign(window, builtinGlobals);

    const moduleFactories = {...ModuleFactories, ...builtinModules};
    genBuiltinModules(
      modules,
      moduleFactories,
      window
    );

    if (__weex_env__.platform !== 'Web') {
      let init = new Function(
        'with (this) { (function(){ "use strict";' + __weex_code__ + '}).call(this); }'
      );

      init.call(
        // Context is window
        window,
      );
    } else {
      let init = new Function(
        '"use strict";' + __weex_code__
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

// Hack for rollup build "import Rax from 'weex-rax-framework'", in rollup if `module.exports` has `__esModule` key must return by export default
export default exports;
