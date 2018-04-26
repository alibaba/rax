import setupWindmillRenderer from '@ali/windmill-renderer/dist/windmill.renderer';
/* global BroadcastChannel */
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
const noop = function() {};

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

function initPageEvent(windmill, window) {
  const supportedPageLifecycles = [
    'load', 'ready', 'show', 'hide', 'unload'
  ];
  const supportedPageEvents = [
    'pullDownRefresh', 'reachBottom', 'shareAppMessage',
    'pageScroll', 'TabItemTap'
  ];

  // listening on page lifecycles
  supportedPageLifecycles.forEach(lifecycle => {
    const eventType = `page:${lifecycle}`;
    console.log(`[Rax] listening on lifecycle: "${eventType}"`);
    windmill.$cycle(eventType, (options) => {
      console.log(`[Rax] receive lifecycle: "${eventType}"`);
      window.dispatchEvent({
        type: eventType,
        timestamp: Date.now(),
        data: options
      });
    });
  });

  // listening on page events
  supportedPageEvents.forEach(eventType => {
    console.log(`[Rax] listening on event: "${eventType}"`);
    windmill.$on(eventType, (event) => {
      console.log(`[Rax] receive event: "${eventType}"`);
      window.dispatchEvent(Object.assign({}, event, {
        type: eventType,
        timestamp: Date.now()
      }));
    });
  });

  // dispatch module call error
  const errorName = 'weexsecurityerror';
  windmill.$on(errorName, message => {
    const errorEvent = typeof window.CustomEvent === 'function'
      ? new window.CustomEvent('WeexSecurityError', { detail: message })
      : { type: 'WeexSecurityError', detail: message };
    window.dispatchEvent(errorName, errorEvent);
  });
}

export function injectContext() {
  let instanceContext = new Function('return this')();
  var window = resetInstanceContext(instanceContext);
  for (var key in window) {
    if (typeof instanceContext[key] === 'undefined' && key != '__weex_data__') {
      instanceContext[key] = window[key];
    }
  }
}

/**
 * create a Weex instance
 *
 * @param  {string} instanceId
 * @param  {string} __weex_code__
 * @param  {object} [__weex_options__] {bundleUrl, debug}
 */
export function resetInstanceContext(instanceContext) {
  let {
    instanceId,
    document,
    bundleUrl,
    __weex_document__,
    __weex_options__,
    __weex_data__,
    __weex_config__
  } = instanceContext;

  const weex = __weex_options__.weex || {};
  const isInWindmill = weex.config.container === 'windmill';
  const windmill = setupWindmillRenderer(weex);

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

  const documentURL = new URL(bundleUrl);
  const modules = {};

  // Generate native modules map at instance init
  const __weex_define__ = require('./define.weex')(modules);
  const __weex_require__ = require('./require.weex')(modules, weex, windmill);
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
    setImmediate: typeof setImmediate === 'function' && setImmediate ||
      function(fn) {
        setTimeout(fn, 0);
      },
    clearImmediate: typeof setImmediate === 'function' && setImmediate ||
      function(id) {
        clearTimeout(id);
      },
    frameworkVersion: '0.6.1', // for debug
    alert: (message) => {
      const modal = __weex_require__(MODAL_MODULE);
      modal.alert({
        message
      }, function() {});
    },
    open: (url) => {
      if (isInWindmill) {
        windmill.$navTo({
          url,
          animated: true,
        });
      } else {
        const weexNavigator = __weex_require__(NAVIGATOR_MODULE);
        weexNavigator.push({
          url,
          animated: true,
        }, noop);
      }
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

      if (typeof BroadcastChannel === 'function') {
        if (targetOrigin == '*') {
          var stack = new BroadcastChannel('message');
          stack.postMessage(event);
        } else {
          var stack = new BroadcastChannel('message' + targetOrigin);
          stack.postMessage(event);
        }
      }
    },
    addEventListener: (type, listener) => {
      console.log('window.addEventListener ' + type);
      if (type === 'message') {
        if (typeof BroadcastChannel === 'function') {
          var stack = new BroadcastChannel('message');
          var thisStack = new BroadcastChannel('message' + bundleUrl);
          stack.onmessage = (e) => {
            listener(e.data);
          };
          thisStack.onmessage = (e) => {
            listener(e.data);
          };
        }
        // for miniApp
        windmill.$on(type, (e) => {
          e.origin = 'worker';
          listener(e);
        });
      } else {
        windowEmitter.on(type, listener);
      }
    },
    removeEventListener: (type, listener) => {
      windowEmitter.off(type, listener);
    },
    dispatchEvent: (e) => {
      console.log('window.dispatchEvent ' + e.type);
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
    callNative: () => {}, // compatible original API
    __weex_document__,
    __weex_module_supports__: weex.isRegisteredModule,
    __weex_tag_supports__: weex.isRegisteredComponent,
    __weex_define__,
    __weex_require__,
    __weex_downgrade__,
    __weex_env__,
    __weex_code__: '',
    __weex_options__,
    __weex_data__,
    __weex_config__
  };

  genBuiltinModules(
    modules,
    ModuleFactories,
    window
  );

  initPageEvent(windmill, window);

  window.self = window.window = window;

  if (isInWindmill) {
    console.log('Rax miniApp jsfm init window, typeof window is ', typeof window);
  } else {
    console.log('Rax jsfm init window, typeof window is ', typeof window);
  }
  return window;
}