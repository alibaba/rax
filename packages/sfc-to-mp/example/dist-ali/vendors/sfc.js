module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../../sfc-runtime/lib/sfc.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../sfc-runtime/lib/Dep.js":
/*!*****************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/Dep.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushTarget = pushTarget;
exports.popTarget = popTarget;
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uid = 0;

var Dep =
/*#__PURE__*/
function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.id = uid++;
    this.subs = [];
  }

  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      var index = this.subs.indexOf(sub);

      if (index > -1) {
        return this.subs.splice(index, 1);
      }
    }
  }, {
    key: "depend",
    value: function depend() {
      if (Dep.target) {
        Dep.target.addDep(this);
      }
    }
  }, {
    key: "notify",
    value: function notify() {
      // stabilize the subscriber list first
      var subs = this.subs.slice();

      for (var i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    }
  }]);

  return Dep;
}();

exports.default = Dep;
Dep.target = null;
var targetStack = [];

function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }

  Dep.target = _target;
}

function popTarget() {
  Dep.target = targetStack.pop();
}

/***/ }),

/***/ "../../sfc-runtime/lib/Set.js":
/*!*****************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/Set.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Set =
/*#__PURE__*/
function () {
  function Set(data) {
    _classCallCheck(this, Set);

    this.data = data || [];
  }

  _createClass(Set, [{
    key: "has",
    value: function has(id) {
      for (var i = 0, l = this.data.length; i < l; i++) {
        if (this.data[i] === id) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "add",
    value: function add(id) {
      if (!this.has(id)) {
        this.data.push(id);
      }

      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.data = [];
    }
  }]);

  return Set;
}();

exports.default = Set;
module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/const.js":
/*!*******************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/const.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayPatchMethods = void 0;
var arrayPatchMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
exports.arrayPatchMethods = arrayPatchMethods;

/***/ }),

/***/ "../../sfc-runtime/lib/initWatch.js":
/*!***********************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/initWatch.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initWatch;

var _utils = __webpack_require__(/*! ./utils */ "../../sfc-runtime/lib/utils.js");

var _watcher = _interopRequireDefault(__webpack_require__(/*! ./watcher */ "../../sfc-runtime/lib/watcher.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initWatch(vm, watch) {
  Object.defineProperty(vm, '$watch', {
    enumerable: false,
    value: $watch
  });

  if (!(0, _utils.isPlainObject)(watch)) {
    return;
  }

  for (var key in watch) {
    var handler = watch[key];

    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if ((0, _utils.isPlainObject)(handler)) {
    options = handler;
    handler = handler.handler;
  }

  if (typeof handler === 'string') {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
}

function $watch(expOrFn, cb, options) {
  var vm = this;

  if ((0, _utils.isPlainObject)(cb)) {
    return createWatcher(vm, expOrFn, cb, options);
  }

  options = options || {};
  options.user = true;
  var watcher = new _watcher.default(vm, expOrFn, cb, options);

  if (options.immediate) {
    cb.call(vm, watcher.value);
  }

  return function unwatchFn() {
    watcher.teardown();
  };
}

module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/lifecyclesMap.js":
/*!***************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/lifecyclesMap.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var lifecyclesMap = {
  beforeMount: 'componentWillMount',
  mounted: 'componentDidMount',
  beforeUpdate: 'componentWillUpdate',
  updated: 'componentDidUpdate',
  beforeDestroy: 'componentWillUnmount'
};
var _default = lifecyclesMap;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/mixin.js":
/*!*******************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/mixin.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxy = proxy;
Object.defineProperty(exports, "mixinComputed", {
  enumerable: true,
  get: function get() {
    return _mixinComputed.default;
  }
});
Object.defineProperty(exports, "mixinProps", {
  enumerable: true,
  get: function get() {
    return _mixinProps.default;
  }
});
Object.defineProperty(exports, "mixinData", {
  enumerable: true,
  get: function get() {
    return _mixinData.default;
  }
});
Object.defineProperty(exports, "mixinSlots", {
  enumerable: true,
  get: function get() {
    return _mixinSlots.default;
  }
});

var _mixinComputed = _interopRequireDefault(__webpack_require__(/*! ./mixinComputed */ "../../sfc-runtime/lib/mixinComputed.js"));

var _mixinProps = _interopRequireDefault(__webpack_require__(/*! ./mixinProps */ "../../sfc-runtime/lib/mixinProps.js"));

var _mixinData = _interopRequireDefault(__webpack_require__(/*! ./mixinData */ "../../sfc-runtime/lib/mixinData.js"));

var _mixinSlots = _interopRequireDefault(__webpack_require__(/*! ./mixinSlots */ "../../sfc-runtime/lib/mixinSlots.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function proxy(source, key, target, targetKey) {
  Object.defineProperty(source, key, {
    enumerable: false,
    configurable: false,
    get: function get() {
      return target[targetKey];
    }
  });
}

/***/ }),

/***/ "../../sfc-runtime/lib/mixinComputed.js":
/*!***************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/mixinComputed.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mixinComputed;

var _utils = __webpack_require__(/*! ./utils */ "../../sfc-runtime/lib/utils.js");

var _watcher = _interopRequireDefault(__webpack_require__(/*! ./watcher */ "../../sfc-runtime/lib/watcher.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: _utils.noop,
  set: _utils.noop
};

function mixinComputed(vm, computed) {
  if (!(0, _utils.isPlainObject)(computed)) {
    return;
  }

  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get; // create internal watcher for the computed property.

    watchers[key] = new _watcher.default(vm, getter || _utils.noop, _utils.noop, {
      computed: true
    }); // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.

    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        (0, _utils.warn)("The computed property \"".concat(key, "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        (0, _utils.warn)("The computed property \"".concat(key, "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed(target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = _utils.noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : _utils.noop;
    sharedPropertyDefinition.set = userDef.set ? userDef.set : _utils.noop;
  }

  if ("development" !== 'production' && sharedPropertyDefinition.set === _utils.noop) {
    sharedPropertyDefinition.set = function () {
      (0, _utils.warn)("Computed property \"".concat(key, "\" was assigned to but it has no setter."), this);
    };
  }

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];

    if (watcher) {
      watcher.depend();
      return watcher.evaluate();
    }
  };
}

module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/mixinData.js":
/*!***********************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/mixinData.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleUpdate = toggleUpdate;
exports.observeWithContext = observeWithContext;
exports.default = mixinData;

var _observe = _interopRequireDefault(__webpack_require__(/*! ./observe */ "../../sfc-runtime/lib/observe.js"));

var _nextTick = _interopRequireDefault(__webpack_require__(/*! ./nextTick */ "../../sfc-runtime/lib/nextTick.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var allowUpdate = true;

function toggleUpdate(allow) {
  var type = _typeof(allow);

  if (type === 'undefined') {
    allowUpdate = !allowUpdate;
  } else if (type === 'boolean') {
    allowUpdate = allow;
  }
}

function observeWithContext(data, context, def) {
  var isDirty = false;

  function update() {
    (0, _nextTick.default)(function () {
      if (allowUpdate && isDirty) {
        context.forceUpdate();
        isDirty = false;
      }
    }, context);
  }

  (0, _observe.default)(data, {
    afterSetter: function afterSetter() {
      isDirty = true;
      update();
    },
    declear: def,
    vm: context._data
  });
}

function mixinData(context, declearation) {
  // init reactive data
  var data = context._data; // data always exists

  var __data_type = _typeof(declearation.data);

  if (__data_type === 'function') {
    data = declearation.data.call(context);
  } else if (__data_type === 'object' && "development" !== 'production') {
    /* istanbul ignore next */
    console.error('[SFC Loader WARN]:', 'The "data" option should be a function that returns a per-instance value in component definitions.');
    data = declearation.data;
  } else {
    /* istanbul ignore next */
    data = null;
  } // $data getter


  Object.defineProperty(context, '$data', {
    get: function get() {
      return data;
    }
  });

  if (!data) {
    return;
  }

  observeWithContext(data, context, declearation);
  Object.keys(data).forEach(function (dataKey) {
    context[dataKey] = data[dataKey];
    Object.defineProperty(context, dataKey, {
      enumerable: true,
      configurable: true,
      get: function proxyGet() {
        return data[dataKey];
      },
      set: function proxySet(newVal) {
        data[dataKey] = newVal;
      }
    });
  });
}

/***/ }),

/***/ "../../sfc-runtime/lib/mixinProps.js":
/*!************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/mixinProps.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mixinProps;

var _utils = __webpack_require__(/*! ./utils */ "../../sfc-runtime/lib/utils.js");

function preventPropsSet() {
  throw new Error('props can not be set');
}

function mixinProps(vm, props, userPropsDef) {
  var _props = {};
  var propsDef = [];

  if (Array.isArray(userPropsDef)) {
    userPropsDef.forEach(function (propKey) {
      if (typeof propKey === 'string') {
        propsDef.push({
          key: propKey
        });
      } else if (true) {
        (0, _utils.warn)('props key should be a string, check definition of', userPropsDef);
      }
    });
  } else if ((0, _utils.isPlainObject)(userPropsDef)) {
    var keys = Object.keys(userPropsDef);

    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      var defaultVal = userPropsDef[key].default;
      propsDef.push({
        key: key,
        defaultVal: defaultVal
      });
    }
  }

  Object.defineProperty(vm, '$props', {
    get: function get() {
      return _props;
    }
  });

  var _loop = function _loop(_i, _l) {
    var _propsDef$_i = propsDef[_i],
        key = _propsDef$_i.key,
        defaultVal = _propsDef$_i.defaultVal;
    _props[key] = props[key] || defaultVal;
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: false,
      get: function get() {
        return _props[key];
      },
      set: preventPropsSet
    });
  };

  for (var _i = 0, _l = propsDef.length; _i < _l; _i++) {
    _loop(_i, _l);
  }
}

module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/mixinSlots.js":
/*!************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/mixinSlots.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mixinSlots;

// null, default or slotName
function getSlotName(item) {
  if (item && Object.hasOwnProperty.call(item, 'props')) {
    return item.props.slot || 'default';
  } else {
    return 'default';
  }
}

function deleteSlot(item) {
  if (item && Object.hasOwnProperty.call(item, 'props')) {
    delete item.props.slot;
  }
}

function mixinSlots(vm, children) {
  var $slots = {};

  function injectSlot(child) {
    var slotName = getSlotName(child);

    if (null === slotName) {
      return;
    }

    $slots[slotName] = $slots[slotName] || [];
    $slots[slotName].push(child); // remove slot attr to avoid disappear

    deleteSlot(child);
  }

  if (Array.isArray(children)) {
    for (var i = 0, l = children.length; i < l; i++) {
      injectSlot(children[i]);
    }
  } else {
    injectSlot(children);
  }

  Object.defineProperty(vm, '$slots', {
    enumerable: false,
    configurable: true,
    get: function get() {
      return $slots;
    }
  });
}

module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/nextTick.js":
/*!**********************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/nextTick.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nextTick;

var _utils = __webpack_require__(/*! ./utils */ "../../sfc-runtime/lib/utils.js");

// next tick
var UA = typeof navigator === 'undefined' ? '' : navigator && navigator.userAgent;
var isWMLIOS = typeof __windmill_environment__ !== 'undefined' && __windmill_environment__.platform === 'iOS';
/* eslint-disable-line */

var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || isWMLIOS;
var callbacks = [];
var pending = false;

var timerFunc = function timerFunc() {
  setTimeout(flushCallbacks, 0);
};

if (typeof Promise !== 'undefined' && (0, _utils.isNative)(Promise)) {
  var p = Promise.resolve();

  timerFunc = function timerFunc() {
    p.then(flushCallbacks); // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.

    if (isIOS) {
      setTimeout(function () {});
    }
  };
}

function flushCallbacks() {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;

  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

function nextTick(cb, ctx) {
  var _resolve;

  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        console.error(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  }

  if (!cb) {
    return new Promise(function (resolve) {
      _resolve = resolve;
    });
  }
}

module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/observe.js":
/*!*********************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/observe.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = __webpack_require__(/*! ./utils */ "../../sfc-runtime/lib/utils.js");

var _const = __webpack_require__(/*! ./const */ "../../sfc-runtime/lib/const.js");

var _scheduler = __webpack_require__(/*! ./scheduler */ "../../sfc-runtime/lib/scheduler.js");

var _Dep = _interopRequireDefault(__webpack_require__(/*! ./Dep */ "../../sfc-runtime/lib/Dep.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var arrayProto = Array.prototype;

function createArrayDelegate(opts) {
  var arrayMethods = Object.create(arrayProto);

  _const.arrayPatchMethods.forEach(function (method) {
    // hijack
    var originalMethod = arrayProto[method];
    Object.defineProperty(arrayMethods, method, {
      value: function value() {
        var ob = this.__ob__;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = originalMethod.apply(this, args);
        var inserted;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            inserted = args.slice(2);
            break;
        }

        if (inserted) {
          ob.observeArray(inserted);
        }

        if (typeof opts.afterSetter === 'function') {
          opts.afterSetter(this);
        } // notify change


        ob.dep.notify();
        return result;
      },
      enumerable: true,
      writable: true,
      configurable: true
    });
  });

  return arrayMethods;
}

function observe(value, options) {
  if (!(0, _utils.isObject)(value)) {
    return;
  }

  if (value && Object.hasOwnProperty.call(value, '__ob__') && value.__ob__ instanceof Observer) {
    return value.__ob__;
  }

  return new Observer(value, options);
}

var Observer =
/*#__PURE__*/
function () {
  function Observer(value, options) {
    _classCallCheck(this, Observer);

    this.value = value;
    this.dep = new _Dep.default();
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    });

    if (Array.isArray(value)) {
      // delegate array methods
      value.__proto__ = createArrayDelegate(options);
      this.observeArray(value, options);
    } else if ((0, _utils.isPlainObject)(value)) {
      this.walk(value, options);
    }
  }

  _createClass(Observer, [{
    key: "walk",
    value: function walk(obj, opt) {
      var keys = Object.keys(obj);

      for (var i = 0; i < keys.length; i++) {
        defineReactive(obj, keys[i], undefined, opt);
      }
    }
  }, {
    key: "observeArray",
    value: function observeArray(items, options) {
      for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i], options);
      }
    }
  }]);

  return Observer;
}();
/**
 * vue observe function
 */


function defineReactive(obj, key, val) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var dep = new _Dep.default();
  var declear = opts.declear,
      vm = opts.vm;
  var property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  } // cater for pre-defined getter/setters


  var getter = property && property.get;
  var setter = property && property.set;

  if ((!getter || setter) && typeof val === 'undefined') {
    val = obj[key];
  }

  var parents = [];

  if (Array.isArray(opts.parents)) {
    parents = parents.concat(opts.parents);
  }

  parents.push(key);
  var children = observe(val, _objectSpread({}, opts, {
    parents: parents
  }));
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;

      if (_Dep.default.target) {
        dep.depend();

        if (children) {
          children.dep.depend();

          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }

      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val; // 值不变的时候不触发

      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }

      dep.notify();

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      if (typeof opts.afterSetter === 'function') {
        opts.afterSetter(newVal);
      }

      children = observe(newVal, _objectSpread({}, opts, {
        parents: parents
      }));
      dep.notify();
    }
  });
}
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */


function dependArray(value) {
  for (var e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

var _default = observe;
exports.default = _default;
module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/scheduler.js":
/*!***********************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/scheduler.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queueWatcher = queueWatcher;
exports.MAX_UPDATE_COUNT = void 0;

var _nextTick = _interopRequireDefault(__webpack_require__(/*! ./nextTick */ "../../sfc-runtime/lib/nextTick.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_UPDATE_COUNT = 100;
exports.MAX_UPDATE_COUNT = MAX_UPDATE_COUNT;
var queue = [];
/* { [key: number]: ?true } */

var has = {};
var waiting = false;
var flushing = false;
var index = 0;
/**
 * Reset the scheduler's state.
 */

function resetSchedulerState() {
  queue.length = 0;
  has = {};
  waiting = flushing = false;
}
/**
 * Flush both queues and run the watchers.
 */


function flushSchedulerQueue() {
  flushing = true;
  /**
   * 在刷新前排序队列，原因：
   * 1、组件都是先更新父组件，然后是子组件。父组件总是比子组件早创建。
   * 2、组件用户watcher总是比render watcher早执行，因为userWatcher总是比render Watcher早创建。
   * 3、如果一个组件在父watcher在执行的时候被销毁，那么他的watcher也会被强制停止。
   */

  queue.sort(function (prev, next) {
    return prev.id - next.id;
  }); // do not cache length, for more watchers might be pushed
  // share the same index

  for (index = 0; index < queue.length; index++) {
    var watcher = queue[index];
    var id = watcher.id;
    has[id] = null;
    watcher.run(); // todo: check circular update
  }

  resetSchedulerState();
}
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */


function queueWatcher(watcher) {
  var id = watcher.id;

  if (has[id] == null) {
    has[id] = true;

    if (!flushing) {
      queue.push(watcher);
    } else {
      // 如果已经在刷新，把 watcher 加入的队列中，
      // 并从小到大排列，如果 flush 的时候，id 比他大的都已经执行，他会被立即执行
      var i = queue.length - 1;

      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }

      queue.splice(Math.max(i, index) + 1, 0, watcher);
    } // queue the flush


    if (!waiting) {
      waiting = true;
      (0, _nextTick.default)(flushSchedulerQueue);
    }
  }
}

/***/ }),

/***/ "../../sfc-runtime/lib/sfc.js":
/*!*****************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/sfc.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mixin = __webpack_require__(/*! ./mixin */ "../../sfc-runtime/lib/mixin.js");

var _initWatch = _interopRequireDefault(__webpack_require__(/*! ./initWatch */ "../../sfc-runtime/lib/initWatch.js"));

var _lifecyclesMap = _interopRequireDefault(__webpack_require__(/*! ./lifecyclesMap */ "../../sfc-runtime/lib/lifecyclesMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SFC =
/*#__PURE__*/
function () {
  function SFC(config) {
    var _this = this;

    _classCallCheck(this, SFC);

    // life cycle: before create
    if (typeof config.beforeCreate === 'function') {
      config.beforeCreate.call(null);
    }

    this._data = {};
    Object.defineProperty(this, '_watchers', {
      enumerable: false,
      value: []
    });

    if (config._global) {
      Object.defineProperty(this, '_global', {
        enumerable: false,
        value: config._global
      });
    } // 1. _watchers
    // 2. props
    // 3. methods
    // 4. data & observe
    // 5. computed
    // 6. watch


    (0, _mixin.mixinProps)(this, config.propsData, config.props); // mixin methods

    if (config.methods) {
      Object.keys(config.methods).forEach(function (methodName) {
        _this[methodName] = config.methods[methodName].bind(_this);
      });
    } // mixin data


    (0, _mixin.mixinData)(this, config);
    Object.defineProperty(this, '$options', {
      enumerable: false,
      configurable: true,
      get: function get() {
        return config;
      }
    });
    (0, _mixin.mixinComputed)(this, config.computed);
    (0, _initWatch.default)(this, config.watch); // fire created

    if (typeof config.created === 'function') {
      config.created.call(this);
    } // bind other life cycle


    var fns = Object.keys(_lifecyclesMap.default);

    for (var i = 0, l = fns.length; i < l; i++) {
      if (typeof config[fns[i]] === 'function') {
        this[_lifecyclesMap.default[fns[i]]] = config[fns[i]].bind(this);
      }
    } // fire destroyed at next tick


    if (typeof config.destroyed === 'function') {
      var prevComponentWillUnmount = this.componentWillUnmount;

      this.componentWillUnmount = function () {
        var _this2 = this,
            _arguments = arguments;

        prevComponentWillUnmount && prevComponentWillUnmount.call(this);
        setTimeout(function () {
          config.destroyed.apply(_this2, _arguments);
        });
      };
    }

    var prevComponentWillReceiveProps = this.componentWillReceiveProps;

    this.componentWillReceiveProps = function (nextProps) {
      prevComponentWillReceiveProps && prevComponentWillReceiveProps.apply(this, arguments);

      if (nextProps.children !== this.props.children) {
        // update slots
        (0, _mixin.mixinSlots)(this, nextProps.children);
      }
    };
  }
  /**
   * @need overrides
   * render not impled
   */


  _createClass(SFC, [{
    key: "render",
    value: function render() {
      return null;
    } // TODO fix me

  }, {
    key: "forceUpdate",
    value: function forceUpdate() {}
  }]);

  return SFC;
}();

exports.default = SFC;
module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/lib/utils.js":
/*!*******************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/utils.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isNative = isNative;
exports.noop = noop;
exports.parsePath = parsePath;
exports.kebabCase = kebabCase;
exports.warn = runtimeWarn;
exports.processPropsData = processPropsData;
Object.defineProperty(exports, "uppercamelcase", {
  enumerable: true,
  get: function get() {
    return _uppercamelcase.default;
  }
});
Object.defineProperty(exports, "camelcase", {
  enumerable: true,
  get: function get() {
    return _camelcase.default;
  }
});
Object.defineProperty(exports, "isWeb", {
  enumerable: true,
  get: function get() {
    return _universalEnv.isWeb;
  }
});
Object.defineProperty(exports, "isNode", {
  enumerable: true,
  get: function get() {
    return _universalEnv.isNode;
  }
});
Object.defineProperty(exports, "isWeex", {
  enumerable: true,
  get: function get() {
    return _universalEnv.isWeex;
  }
});
Object.defineProperty(exports, "isReactNative", {
  enumerable: true,
  get: function get() {
    return _universalEnv.isReactNative;
  }
});

var _uppercamelcase = _interopRequireDefault(__webpack_require__(/*! uppercamelcase */ "../../sfc-runtime/node_modules/_uppercamelcase@3.0.0@uppercamelcase/index.js"));

var _camelcase = _interopRequireDefault(__webpack_require__(/*! camelcase */ "../../sfc-runtime/node_modules/_camelcase@5.0.0@camelcase/index.js"));

var _universalEnv = __webpack_require__(/*! universal-env */ "../../sfc-runtime/node_modules/_universal-env@0.6.6@universal-env/lib/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// including any obj
function isObject(obj) {
  return obj !== null && _typeof(obj) === 'object';
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

function noop() {}
/**
 * Parse simple path.
 */


var bailRE = /[^\w.$]/;

function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }

  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }

      obj = obj[segments[i]];
    }

    return obj;
  };
}

function kebabCase(string) {
  var kebab = '';

  for (var i = 0, l = string.length; i < l; i++) {
    if (/[a-z]/.test(string[i])) {
      kebab += string[i];
    } else if (/[A-Z]/.test(string[i])) {
      kebab += '-' + string[i].toLowerCase();
    } else if (string[i] === '-') {
      kebab += '-';
    }
  }

  if (kebab[0] === '-') {
    return kebab.slice(1);
  } else {
    return kebab;
  }
}

function runtimeWarn() {
  var _console$warn;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  (_console$warn = console.warn).call.apply(_console$warn, [console, '[SFC WARN]'].concat(args));
}

/**
* support for include template
*/
function processPropsData() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var data = Object.create(props.data || {});
  var pageInstance = props.pageInstance;
  Object.keys(props.data || {}).forEach(function (key) {
    var val = props.data[key];

    if (typeof val === 'string') {
      data[key] = pageInstance && typeof pageInstance[val] === 'function' ? pageInstance[val].bind(pageInstance) : val;
    }
  });
  return data;
}

/***/ }),

/***/ "../../sfc-runtime/lib/watcher.js":
/*!*********************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/lib/watcher.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Dep = _interopRequireWildcard(__webpack_require__(/*! ./Dep */ "../../sfc-runtime/lib/Dep.js"));

var _scheduler = __webpack_require__(/*! ./scheduler */ "../../sfc-runtime/lib/scheduler.js");

var _utils = __webpack_require__(/*! ./utils */ "../../sfc-runtime/lib/utils.js");

var _Set = _interopRequireDefault(__webpack_require__(/*! ./Set */ "../../sfc-runtime/lib/Set.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var uid = 0;

var Watcher =
/*#__PURE__*/
function () {
  function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
    _classCallCheck(this, Watcher);

    this.vm = vm;

    if (isRenderWatcher) {
      vm._watcher = this;
    }

    vm._watchers.push(this); // options


    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.computed = !!options.computed;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.computed = this.sync = false;
    }

    this.cb = cb;
    this.id = ++uid;
    this.active = true;
    this.dirty = this.computed; // for computed watchers

    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set.default();
    this.newDepIds = new _Set.default();
    this.expression =  true ? expOrFn.toString() : undefined; // parse expression for getter

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = (0, _utils.parsePath)(expOrFn);

      if (!this.getter) {
        this.getter = function () {};
      }
    }

    if (this.computed) {
      this.value = undefined;
      this.dep = new _Dep.default();
    } else {
      this.value = this.get();
    }
  }
  /**
   * Evaluate the getter, and re-collect dependencies.
   */


  _createClass(Watcher, [{
    key: "get",
    value: function get() {
      (0, _Dep.pushTarget)(this);
      var value;
      var vm = this.vm;

      try {
        value = this.getter.call(vm, vm);
      } catch (e) {
        if (this.user) {
          console.error(e, vm, "getter for watcher \"".concat(this.expression, "\""));
        } else {
          throw e;
        }
      } finally {
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        // if (this.deep) {
        //   traverse(value)
        // }
        (0, _Dep.popTarget)();
        this.cleanupDeps();
      }

      return value;
    }
    /**
     * Add a dependency to this directive.
     */

  }, {
    key: "addDep",
    value: function addDep(dep) {
      var id = dep.id;

      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);

        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    }
    /**
     * Clean up for dependency collection.
     */

  }, {
    key: "cleanupDeps",
    value: function cleanupDeps() {
      var i = this.deps.length;

      while (i--) {
        var dep = this.deps[i];

        if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this);
        }
      }

      var tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    }
    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */

  }, {
    key: "run",
    value: function run() {
      if (this.active) {
        this.getAndInvoke(this.cb);
      }
    }
    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */

  }, {
    key: "update",
    value: function update() {
      var _this = this;

      if (this.computed) {
        // A computed property watcher has two modes: lazy and activated.
        // It initializes as lazy by default, and only becomes activated when
        // it is depended on by at least one subscriber, which is typically
        // another computed property or a component's render function.
        if (this.dep.subs.length === 0) {
          // In lazy mode, we don't want to perform computations until necessary,
          // so we simply mark the watcher as dirty. The actual computation is
          // performed just-in-time in this.evaluate() when the computed property
          // is accessed.
          this.dirty = true;
        } else {
          // In activated mode, we want to proactively perform the computation
          // but only notify our subscribers when the value has indeed changed.
          this.getAndInvoke(function () {
            _this.dep.notify();
          });
        }
      } else if (this.sync) {
        this.run();
      } else {
        (0, _scheduler.queueWatcher)(this);
      }
    }
  }, {
    key: "getAndInvoke",
    value: function getAndInvoke(cb) {
      var value = this.get();

      if (value !== this.value || // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      (0, _utils.isObject)(value) || this.deep) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        this.dirty = false;

        if (this.user) {
          try {
            cb.call(this.vm, value, oldValue);
          } catch (e) {
            console.error(e, this.vm, "callback for watcher \"".concat(this.expression, "\""));
          }
        } else {
          cb.call(this.vm, value, oldValue);
        }
      }
    }
    /**
     * Evaluate and return the value of the watcher.
     * This only gets called for computed property watchers.
     */

  }, {
    key: "evaluate",
    value: function evaluate() {
      if (this.dirty) {
        this.value = this.get();
        this.dirty = false;
      }

      return this.value;
    }
    /**
     * Depend on this watcher. Only for computed property watchers.
     */

  }, {
    key: "depend",
    value: function depend() {
      if (this.dep && _Dep.default.target) {
        this.dep.depend();
      }
    }
    /**
     * Remove self from all dependencies' subscriber list.
     */

  }, {
    key: "teardown",
    value: function teardown() {
      if (this.active) {
        // remove self from vm's watcher list
        // this is a somewhat expensive operation so we skip it
        // if the vm is being destroyed.
        if (!this.vm._isBeingDestroyed) {
          var watchers = this.vm._watchers;

          if (watchers.length) {
            var index = watchers.indexOf(this);

            if (index > -1) {
              return watchers.splice(index, 1);
            }
          }
        }

        var i = this.deps.length;

        while (i--) {
          this.deps[i].removeSub(this);
        }

        this.active = false;
      }
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;
module.exports = exports["default"];

/***/ }),

/***/ "../../sfc-runtime/node_modules/_camelcase@4.1.0@camelcase/index.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/node_modules/_camelcase@4.1.0@camelcase/index.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function preserveCamelCase(str) {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < str.length; i++) {
		const c = str[i];

		if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
			str = str.substr(0, i) + '-' + str.substr(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
			str = str.substr(0, i - 1) + '-' + str.substr(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = c.toLowerCase() === c;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = c.toUpperCase() === c;
		}
	}

	return str;
}

module.exports = function (str) {
	if (arguments.length > 1) {
		str = Array.from(arguments)
			.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		str = str.trim();
	}

	if (str.length === 0) {
		return '';
	}

	if (str.length === 1) {
		return str.toLowerCase();
	}

	if (/^[a-z0-9]+$/.test(str)) {
		return str;
	}

	const hasUpperCase = str !== str.toLowerCase();

	if (hasUpperCase) {
		str = preserveCamelCase(str);
	}

	return str
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
};


/***/ }),

/***/ "../../sfc-runtime/node_modules/_camelcase@5.0.0@camelcase/index.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/node_modules/_camelcase@5.0.0@camelcase/index.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const preserveCamelCase = input => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < input.length; i++) {
		const c = input[i];

		if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
			input = input.slice(0, i) + '-' + input.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
			input = input.slice(0, i - 1) + '-' + input.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = c.toLowerCase() === c;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = c.toUpperCase() === c;
		}
	}

	return input;
};

module.exports = (input, options) => {
	options = Object.assign({
		pascalCase: false
	}, options);

	const postProcess = x => options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x;

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	if (input.length === 1) {
		return options.pascalCase ? input.toUpperCase() : input.toLowerCase();
	}

	if (/^[a-z\d]+$/.test(input)) {
		return postProcess(input);
	}

	const hasUpperCase = input !== input.toLowerCase();

	if (hasUpperCase) {
		input = preserveCamelCase(input);
	}

	input = input
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());

	return postProcess(input);
};


/***/ }),

/***/ "../../sfc-runtime/node_modules/_universal-env@0.6.6@universal-env/lib/index.js":
/*!*******************************************************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/node_modules/_universal-env@0.6.6@universal-env/lib/index.js ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isReactNative = exports.isWeex = exports.isNode = exports.isWeb = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// https://www.w3.org/TR/html5/webappapis.html#dom-navigator-appcodename
var isWeb = (typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === 'object' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko');
exports.isWeb = isWeb;
var isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
exports.isNode = isNode;
var isWeex = typeof callNative === 'function' || (typeof WXEnvironment === "undefined" ? "undefined" : _typeof(WXEnvironment)) === 'object' && WXEnvironment.platform !== 'Web';
exports.isWeex = isWeex;
var isReactNative = typeof __fbBatchedBridgeConfig !== 'undefined';
exports.isReactNative = isReactNative;
exports["default"] = module.exports;
var _default = module.exports;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../sfc-to-mp/node_modules/process/browser.js */ "../node_modules/process/browser.js")))

/***/ }),

/***/ "../../sfc-runtime/node_modules/_uppercamelcase@3.0.0@uppercamelcase/index.js":
/*!*****************************************************************************************************************************!*\
  !*** /Users/noyobo/home/gitlab/alibaba/rax/packages/sfc-runtime/node_modules/_uppercamelcase@3.0.0@uppercamelcase/index.js ***!
  \*****************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const camelCase = __webpack_require__(/*! camelcase */ "../../sfc-runtime/node_modules/_camelcase@4.1.0@camelcase/index.js");

module.exports = function () {
	const cased = camelCase.apply(camelCase, arguments);
	return cased.charAt(0).toUpperCase() + cased.slice(1);
};


/***/ }),

/***/ "../node_modules/process/browser.js":
/*!******************************************!*\
  !*** ../node_modules/process/browser.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })

/******/ });