'use strict'; 

import {ModuleFactories} from './builtin';
import EventEmitter from './emitter';

let NativeComponents = {};
let NativeModules = {};

let Document;
let Element;
let Comment;

const MODULE_NAME_PREFIX = '@weex-module/';
const MODAL_MODULE = MODULE_NAME_PREFIX + 'modal';
const NAVIGATOR_MODULE = MODULE_NAME_PREFIX + 'navigator';
const GLOBAL_EVENT_MODULE = MODULE_NAME_PREFIX + 'globalEvent';
// Instance hub
const instances = {};
// Bundles hub
const bundles = {};
const noop = function() {};

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

function __weex_module_supports__(name) {
  let parts = name.split('.');
  if (parts.length === 1) {
    return Boolean(NativeModules[name]);
  } else {
    let moduleName = parts[0];
    let methodName = parts[1];
    let moduleMethods = NativeModules[moduleName];

    if (moduleMethods) {
      for (let i = 0; i < moduleMethods.length; i++) {
        let method = moduleMethods[i];
        if (typeof method === 'object' && method.name === methodName || method === methodName) {
          return true;
        }
      }
    }

    return false;
  }
}

function __weex_tag_supports__(name) {
  return Boolean(NativeComponents[name]);
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

/**
 * create a Weex instance
 *
 * @param  {string} instanceId
 * @param  {string} __weex_code__
 * @param  {object} [__weex_options__] {bundleUrl, debug}
 */
// export function createInstance(instanceId, __weex_code__, __weex_options__, __weex_data__, __weex_config__) {
export function resetInstanceContext(instanceContext) {

  let {
    document,
    __weex_document__,
    __weex_options__,
    __weex_data__,
    __weex_config__
  } = instanceContext;

  // Mark start time
  const responseEnd = Date.now();
  const __weex_env__ = typeof WXEnvironment === 'object' && WXEnvironment || {};
  // For better performance use built-in promise first
  const shared = require('runtime-shared/dist/shared.function')();

  const Promise = typeof Promise === 'function' ? Promise : shared.Promise;
  const Symbol = typeof Symbol === 'function' ? Symbol : shared.Symbol;
  const Set = typeof Set === 'function' ? Set : shared.Set;
  const Map = typeof Map === 'function' ? Map : shared.Map;
  const WeakMap = typeof WeakMap === 'function' ? WeakMap : shared.WeakMap;
  const WeakSet = typeof WeakSet === 'function' ? WeakSet : shared.WeakSet;
  const {URL, URLSearchParams, FontFace, matchMedia} = shared;
  let bundleUrl = __weex_options__.bundleUrl || 'about:blank';

  if (!__weex_options__.bundleUrl) {
    console.error('Error: Must have bundleUrl option when createInstance, downgrade to "about:blank".');
  } else if (!bundleUrl.split('//')[0]) {
    bundleUrl = 'https:' + bundleUrl;
  }

  const documentURL = new URL(bundleUrl);
  const modules = {};

  instance = instances[instanceId] = {
    document,
    instanceId,
    bundleUrl,
    bundleCode: __weex_code__,
    modules,
    origin: documentURL.origin,
    uid: 0
  };

  // Generate native modules map at instance init
  genNativeModules(modules, document);
  const __weex_define__ = require('./define.weex')(modules);
  const __weex_require__ = require('./require.weex')(modules);
  const __weex_downgrade__ = require('./downgrade.weex')(__weex_require__);
  // Extend document
  require('./document.weex')(__weex_require__, document);

  const location = require('./location.weex')(__weex_require__, documentURL);

  const {
    fetch,
    Headers,
    Request,
    Response
  } = require('./fetch.weex')(__weex_require__, Promise);

  const XMLHttpRequest = require('./xmlhttprequest.weex')(__weex_require__);
  const WebSocket = require('./websocket.weex')(__weex_require__);

  const {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame,
    cancelAnimationFrame
  } = require('./timer.weex')(__weex_require__, document);

  const {
    atob,
    btoa
  } = require('./base64.weex')();

  const performance = require('./performance.weex')(responseEnd);
  const {Event, CustomEvent} = require('./event.weex')();

  const windowEmitter = new EventEmitter();

  let errorHandler = null;
  function registerErrorHandler() {
    if (registerErrorHandler.once) return;

    const globalEvent = __weex_require__(GLOBAL_EVENT_MODULE);
    globalEvent.addEventListener('exception', (e) => {
      // TODO: miss lineno and colno
      // window.onerror = function(messageOrEvent, source, lineno, colno, error) { ... }
      errorHandler(e.exception, e.bundleUrl, 0, 0, new Error(e.exception, e.bundleUrl, 0));
    });

    registerErrorHandler.once = true;
  }

  const window = {
    // ES
    Promise,
    Symbol,
    Map,
    Set,
    WeakMap,
    WeakSet,
    // W3C: https://www.w3.org/TR/html5/browsers.html#browsing-context-name
    name: '',
    // This read-only property indicates whether the referenced window is closed or not.
    closed: false,
    atob,
    btoa,
    performance,
    // W3C
    document,
    location,
    // https://www.w3.org/TR/2009/WD-html5-20090423/browsers.html#dom-navigator
    navigator: {
      product: 'Weex',
      platform: __weex_env__.platform,
      appName: __weex_env__.appName,
      appVersion: __weex_env__.appVersion,
      // Weex/0.12 iOS/9.3 (iPhone7,2) AppName/0.12
      userAgent: `Weex/${__weex_env__.weexVersion} ${__weex_env__.platform}/${__weex_env__.osVersion} (${__weex_env__.deviceModel}) ${__weex_env__.appName}/${__weex_env__.appVersion}`
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
    XMLHttpRequest,
    URL,
    URLSearchParams,
    FontFace,
    WebSocket,
    Event,
    CustomEvent,
    matchMedia,
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
        animated: true,
      }, noop);
    },
    close: () => {
      const weexNavigator = __weex_require__(NAVIGATOR_MODULE);
      weexNavigator.close({
        animated: true
      }, noop, noop);
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
    set onerror(handler) {
      if (typeof handler == 'function') {
        errorHandler = handler;
        registerErrorHandler();
      } else {
        errorHandler = null;
      }
    },
    get onerror() {
      return errorHandler;
    },
    // ModuleJS
    define: __weex_define__,
    require: __weex_require__,
    // Weex
    __weex_document__,
    __weex_module_supports__,
    __weex_tag_supports__,
    __weex_define__,
    __weex_require__,
    __weex_downgrade__,
    __weex_env__,
    __weex_code__,
    __weex_options__,
    __weex_data__,
    __weex_config__
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

  return window;

}
