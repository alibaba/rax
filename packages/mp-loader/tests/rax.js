/* eslint-disable */ 
var raxFactory = function(require, exports, module) {
  var __weex_document__ = this.__weex_document__;
  var document = this.document;
  module.exports = /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
      /******/
      /******/ 		// Check if module is in cache
      /******/ 		if (installedModules[moduleId]) {
        /******/ 			return installedModules[moduleId].exports;
        /******/
      }
      /******/ 		// Create a new module (and put it into the cache)
      /******/ 		var module = installedModules[moduleId] = {
        /******/ 			i: moduleId,
        /******/ 			l: false,
        /******/ 			exports: {}
        /******/
      };
      /******/
      /******/ 		// Execute the module function
      /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ 		// Flag the module as loaded
      /******/ 		module.l = true;
      /******/
      /******/ 		// Return the exports of the module
      /******/ 		return module.exports;
      /******/
    }
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
      /******/ 		if (!__webpack_require__.o(exports, name)) {
        /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /******/
      }
      /******/
    };
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
      /******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
      }
      /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
      /******/ 		if (mode & 1) value = __webpack_require__(value);
      /******/ 		if (mode & 8) return value;
      /******/ 		if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
      /******/ 		var ns = Object.create(null);
      /******/ 		__webpack_require__.r(ns);
      /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      /******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function(key) {
        return value[key];
      }.bind(null, key));
      /******/ 		return ns;
      /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
      /******/ 		var getter = module && module.__esModule ?
      /******/ 			function getDefault() {
          return module.default;
        } :
      /******/ 			function getModuleExports() {
          return module;
        };
      /******/ 		__webpack_require__.d(getter, 'a', getter);
      /******/ 		return getter;
      /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = '';
    /******/
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = 49);
    /******/
  })([
  /* 0 */
  /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /*
         * Stateful things in runtime
         */
      exports.default = {
        component: null,
        mountID: 1,
        sandbox: true,
        // Roots
        rootComponents: {},
        rootInstances: {},
        // Inject
        hook: null,
        driver: null,
        monitor: null
      };
      module.exports = exports.default;

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _element = __webpack_require__(7);

      var _unmountComponentAtNode = __webpack_require__(6);

      var _unmountComponentAtNode2 = _interopRequireDefault(_unmountComponentAtNode);

      var _instantiateComponent = __webpack_require__(3);

      var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);

      var _shouldUpdateComponent = __webpack_require__(5);

      var _shouldUpdateComponent2 = _interopRequireDefault(_shouldUpdateComponent);

      var _root = __webpack_require__(47);

      var _root2 = _interopRequireDefault(_root);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      /**
         * Instance manager
         */
      var KEY = '$$instance';

      exports.default = {
        set: function set(node, instance) {
          if (!node[KEY]) {
            node[KEY] = instance;
            // Record root instance to roots map
            if (instance.rootID) {
              _host2.default.rootInstances[instance.rootID] = instance;
              _host2.default.rootComponents[instance.rootID] = instance._internal;
            }
          }
        },
        get: function get(node) {
          return node[KEY];
        },
        remove: function remove(node) {
          var instance = this.get(node);
          if (instance) {
            node[KEY] = null;
            if (instance.rootID) {
              delete _host2.default.rootComponents[instance.rootID];
              delete _host2.default.rootInstances[instance.rootID];
            }
          }
        },
        mount: function mount(element, container, parentInstance) {
          if (false) { }

          // Before render callback
          _host2.default.driver.beforeRender && _host2.default.driver.beforeRender();

          // Real native root node is body
          if (container == null) {
            container = _host2.default.driver.createBody();
          }

          // Get the context from the conceptual parent component.
          var parentContext = void 0;
          if (parentInstance) {
            var parentInternal = parentInstance._internal;
            parentContext = parentInternal._processChildContext(parentInternal._context);
          }

          var prevRootInstance = this.get(container);
          var hasPrevRootInstance = prevRootInstance && prevRootInstance.isRootComponent;

          if (hasPrevRootInstance) {
            var prevRenderedComponent = prevRootInstance.getRenderedComponent();
            var prevElement = prevRenderedComponent._currentElement;
            if ((0, _shouldUpdateComponent2.default)(prevElement, element)) {
              var prevUnmaskedContext = prevRenderedComponent._context;
              prevRenderedComponent.updateComponent(prevElement, element, prevUnmaskedContext, parentContext || prevUnmaskedContext);

              return prevRootInstance;
            } else {
              _host2.default.hook.Reconciler.unmountComponent(prevRootInstance);
              (0, _unmountComponentAtNode2.default)(container);
            }
          }

          var wrappedElement = (0, _element.createElement)(_root2.default, null, element);
          var renderedComponent = (0, _instantiateComponent2.default)(wrappedElement);
          var defaultContext = parentContext || {};
          var rootInstance = renderedComponent.mountComponent(container, null, defaultContext);
          this.set(container, rootInstance);

          // After render callback
          _host2.default.driver.afterRender && _host2.default.driver.afterRender(rootInstance);

          // Devtool render new root hook
          _host2.default.hook.Mount._renderNewRootComponent(rootInstance._internal);

          if (false) { }

          return rootInstance;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 2 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      /**
         * Base component class.
         */
      var Component = function() {
        function Component(props, context, updater) {
          _classCallCheck(this, Component);

          this.props = props;
          this.context = context;
          this.refs = {};
          this.updater = updater;
        }

        _createClass(Component, [{
          key: 'isComponentClass',
          value: function isComponentClass() { }
        }, {
          key: 'setState',
          value: function setState(partialState, callback) {
            this.updater.setState(this, partialState, callback);
          }
        }, {
          key: 'forceUpdate',
          value: function forceUpdate(callback) {
            this.updater.forceUpdate(this, callback);
          }
        }]);

        return Component;
      }();

      exports.default = Component;
      module.exports = exports.default;

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function instantiateComponent(element) {
        var instance = void 0;

        if (element === undefined || element === null || element === false || element === true) {
          instance = new _host2.default.EmptyComponent();
        } else if (Array.isArray(element)) {
          instance = new _host2.default.FragmentComponent(element);
        } else if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element.type) {
          // Special case string values
          if (typeof element.type === 'string') {
            instance = new _host2.default.NativeComponent(element);
          } else {
            instance = new _host2.default.CompositeComponent(element);
          }
        } else if (typeof element === 'string' || typeof element === 'number') {
          instance = new _host2.default.TextComponent(element);
        } else {
          throw new Error('Invalid element type: ' + element + '. (keys: ' + Object.keys(element) + ')');
        }

        instance._mountIndex = 0;

        return instance;
      }

      exports.default = instantiateComponent;
      module.exports = exports.default;

      /***/
    },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _inject = __webpack_require__(45);

      var _inject2 = _interopRequireDefault(_inject);

      var _instance = __webpack_require__(1);

      var _instance2 = _interopRequireDefault(_instance);

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function render(element, container, options, callback) {
        // Compatible with `render(element, container, callback)`
        if (typeof options === 'function') {
          callback = options;
          options = null;
        }

        options = options || {};
        // Init inject
        (0, _inject2.default)(options);

        var rootComponent = _instance2.default.mount(element, container, options.parent);
        var componentInstance = rootComponent.getPublicInstance();

        if (callback) {
          callback.call(componentInstance);
        }

        return componentInstance;
      }

      exports.default = render;
      module.exports = exports.default;

      /***/
    },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      function shouldUpdateComponent(prevElement, nextElement) {
        // TODO: prevElement and nextElement could be array
        var prevEmpty = prevElement === null;
        var nextEmpty = nextElement === null;
        if (prevEmpty || nextEmpty) {
          return prevEmpty === nextEmpty;
        }

        var prevType = typeof prevElement === 'undefined' ? 'undefined' : _typeof(prevElement);
        var nextType = typeof nextElement === 'undefined' ? 'undefined' : _typeof(nextElement);
        if (prevType === 'string' || prevType === 'number') {
          return nextType === 'string' || nextType === 'number';
        } else {
          return prevType === 'object' && nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
        }
      }

      exports.default = shouldUpdateComponent;
      module.exports = exports.default;

      /***/
    },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = unmountComponentAtNode;

      var _instance = __webpack_require__(1);

      var _instance2 = _interopRequireDefault(_instance);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function unmountComponentAtNode(node) {
        var component = _instance2.default.get(node);

        if (!component) {
          return false;
        }

        _instance2.default.remove(node);
        component._internal.unmountComponent();

        return true;
      };
      module.exports = exports.default;

      /***/
    },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      exports.createElement = createElement;
      exports.createFactory = createFactory;
      exports.cloneElement = cloneElement;
      exports.isValidElement = isValidElement;

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _flattenChildren = __webpack_require__(15);

      var _flattenChildren2 = _interopRequireDefault(_flattenChildren);

      var _universalEnv = __webpack_require__(14);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var RESERVED_PROPS = {
        key: true,
        ref: true
      };

      function getRenderErrorInfo() {
        if (_host2.default.component) {
          var name = _host2.default.component.getName();
          if (name) {
            return ' Check the render method of `' + name + '`.';
          }
        }
        return '';
      }

      function Element(type, key, ref, props, owner) {
        if (_universalEnv.isWeex) {
          props = filterProps(type, props);
        }

        return {
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
      };

      exports.default = Element;


      function flattenStyle(style) {
        if (!style) {
          return undefined;
        }

        if (!Array.isArray(style)) {
          return style;
        } else {
          var result = {};
          for (var i = 0; i < style.length; ++i) {
            var computedStyle = flattenStyle(style[i]);
            if (computedStyle) {
              for (var key in computedStyle) {
                result[key] = computedStyle[key];
              }
            }
          }
          return result;
        }
      }

      // TODO: move to weex-drvier
      function filterProps(type, props) {
        // Only for weex text
        if (type === 'text') {
          var children = props.children;
          var value = props.value;

          // Value is first
          if (value == null && children != null) {
            if (Array.isArray(children)) {
              children = children.map(function(val) {
                if (typeof val === 'number' || typeof val === 'string') {
                  return val;
                } else {
                  return '';
                }
              }).join('');
            } else if (typeof children !== 'number' && typeof children !== 'string') {
              children = '';
            }

            props.value = String(children);
          }

          props.children = null;
        }

        return props;
      }

      function createElement(type, config, children) {
        if (type == null) {
          throw Error('createElement: type should not be null or undefined.' + getRenderErrorInfo());
        }
        // Reserved names are extracted
        var props = {};
        var propName = void 0;
        var key = null;
        var ref = null;

        if (config != null) {
          ref = config.ref === undefined ? null : config.ref;
          key = config.key === undefined ? null : String(config.key);
          // Remaining properties are added to a new props object
          for (propName in config) {
            if (!RESERVED_PROPS[propName]) {
              props[propName] = config[propName];
            }
          }
        }

        var childrenLength = arguments.length - 2;
        if (childrenLength > 0) {
          if (childrenLength === 1 && !Array.isArray(children)) {
            props.children = children;
          } else {
            var childArray = children;
            if (childrenLength > 1) {
              childArray = new Array(childrenLength);
              for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
              }
            }
            props.children = (0, _flattenChildren2.default)(childArray);
          }
        }

        // Resolve default props
        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps;
          for (propName in defaultProps) {
            if (props[propName] === undefined) {
              props[propName] = defaultProps[propName];
            }
          }
        }

        if (props.style && (Array.isArray(props.style) || _typeof(props.style) === 'object')) {
          props.style = flattenStyle(props.style);
        }

        return new Element(type, key, ref, props, _host2.default.component);
      }

      function createFactory(type) {
        var factory = createElement.bind(null, type);
        // Expose the type on the factory and the prototype so that it can be
        // easily accessed on elements. E.g. `<Foo />.type === Foo`.
        // This should not be named `constructor` since this may not be the function
        // that created the element, and it may not even be a constructor.
        factory.type = type;
        return factory;
      }

      function cloneElement(element, config) {
        if (!isValidElement(element)) {
          throw Error('cloneElement: not a valid element.' + getRenderErrorInfo());
        }

        // Original props are copied
        var props = Object.assign({}, element.props);

        // Reserved names are extracted
        var key = element.key;
        var ref = element.ref;

        // Owner will be preserved, unless ref is overridden
        var owner = element._owner;

        if (config) {
          // Should reset ref and owner if has a new ref
          if (config.ref !== undefined) {
            ref = config.ref;
            owner = _host2.default.component;
          }

          if (config.key !== undefined) {
            key = String(config.key);
          }

          // Resolve default props
          var defaultProps = void 0;
          if (element.type && element.type.defaultProps) {
            defaultProps = element.type.defaultProps;
          }
          // Remaining properties override existing props
          var propName = void 0;
          for (propName in config) {
            if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              if (config[propName] === undefined && defaultProps !== undefined) {
                // Resolve default props
                props[propName] = defaultProps[propName];
              } else {
                props[propName] = config[propName];
              }
            }
          }
        }

        for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          children[_key - 2] = arguments[_key];
        }

        if (children.length) {
          props.children = (0, _flattenChildren2.default)(children);
        }

        return new Element(element.type, key, ref, props, owner);
      };

      function isValidElement(object) {
        return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.type && object.props;
      }

      /***/
    },
    /* 8 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function findDOMNode(instance) {
        if (instance == null) {
          return null;
        }

        // If a native node, weex may not export ownerDocument property
        if (instance.ownerDocument || instance.nodeType) {
          return instance;
        }

        // Native component
        if (instance._nativeNode) {
          return instance._nativeNode;
        }

        if (typeof instance == 'string') {
          return _host2.default.driver.getElementById(instance);
        }

        if (typeof instance.render !== 'function') {
          throw new Error('findDOMNode: find by neither component nor DOM node.');
        }

        // Composite component
        var internal = instance._internal;

        if (internal) {
          while (!internal._nativeNode) {
            internal = internal._renderedComponent;
            // If not mounted
            if (internal == null) {
              return null;
            }
          }
          return internal._nativeNode;
        } else {
          throw new Error('findDOMNode: find on an unmounted component.');
        }
      }

      exports.default = findDOMNode;
      module.exports = exports.default;

      /***/
    },
    /* 9 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.transformPropsAttrsToStyle = transformPropsAttrsToStyle;
      exports.renamePropsAttr = renamePropsAttr;
      /**
         * transformPropAttrsToStyle
         *
         * @param {Object} props
         * @param {Array} attrs
         */
      function transformPropsAttrsToStyle(props, attrs) {
        props.style = props.style || {};

        attrs.forEach(function(attr) {
          if (props[attr] && !props.style[attr]) {
            props.style[attr] = props[attr];
            delete props[attr];
          }
        });

        return props;
      };

      /**
         * renamePropsAttr
         *
         * @param {Object} props
         * @param {String} originalAttrName
         * @param {String} newAttrName
         */
      function renamePropsAttr(props, originalAttrName, newAttrName) {
        if (props[originalAttrName] && !props[newAttrName]) {
          props[newAttrName] = props[originalAttrName];
          delete props[originalAttrName];
        }

        return props;
      }
      exports.default = module.exports;
      exports.default = module.exports;

      /***/
    },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      exports.default = function(children, element, index) {
        var elementKey = element && element.key;
        var hasKey = typeof elementKey === 'string';
        var defaultName = '.' + index.toString(36);

        if (hasKey) {
          var keyName = '$' + elementKey;
          // Child keys must be unique.
          var keyUnique = children[keyName] === undefined;
          // Only the first child will be used when encountered two children with the same key
          if (!keyUnique) console.warn('Encountered two children with the same key "' + elementKey + '".');

          return keyUnique ? keyName : defaultName;
        } else {
          return defaultName;
        }
      };

      module.exports = exports.default;

      /***/
    },
    /* 11 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /*
         * Ref manager
         */

      exports.default = {
        update: function update(prevElement, nextElement, component) {
          var prevRef = prevElement != null && prevElement.ref;
          var nextRef = nextElement != null && nextElement.ref;

          // Update refs in owner component
          if (prevRef !== nextRef) {
            // Detach prev RenderedElement's ref
            prevRef != null && this.detach(prevElement._owner, prevRef, component);
            // Attach next RenderedElement's ref
            nextRef != null && this.attach(nextElement._owner, nextRef, component);
          }
        },
        attach: function attach(ownerComponent, ref, component) {
          if (!ownerComponent) {
            throw new Error('You might be adding a ref to a component that was not created inside a component\'s ' + '`render` method, or you have multiple copies of Rax loaded.');
          }

          var instance = component.getPublicInstance();
          if (typeof ref === 'function') {
            ref(instance);
          } else {
            ownerComponent._instance.refs[ref] = instance;
          }
        },
        detach: function detach(ownerComponent, ref, component) {
          if (typeof ref === 'function') {
            // When the referenced component is unmounted and whenever the ref changes, the old ref will be called with null as an argument.
            ref(null);
          } else {
            // Must match component and ref could detach the ref on owner when A's before ref is B's current ref
            var instance = component.getPublicInstance();
            if (ownerComponent._instance.refs[ref] === instance) {
              delete ownerComponent._instance.refs[ref];
            }
          }
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _ref = __webpack_require__(11);

      var _ref2 = _interopRequireDefault(_ref);

      var _instantiateComponent = __webpack_require__(3);

      var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);

      var _shouldUpdateComponent = __webpack_require__(5);

      var _shouldUpdateComponent2 = _interopRequireDefault(_shouldUpdateComponent);

      var _getElementKeyName = __webpack_require__(10);

      var _getElementKeyName2 = _interopRequireDefault(_getElementKeyName);

      var _instance = __webpack_require__(1);

      var _instance2 = _interopRequireDefault(_instance);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      var STYLE = 'style';
      var CHILDREN = 'children';
      var TREE = 'tree';
      var EVENT_PREFIX_REGEXP = /^on[A-Z]/;

      /**
         * Native Component
         */

      var NativeComponent = function() {
        function NativeComponent(element) {
          _classCallCheck(this, NativeComponent);

          this._currentElement = element;
        }

        _createClass(NativeComponent, [{
          key: 'mountComponent',
          value: function mountComponent(parent, parentInstance, context, childMounter) {
            // Parent native element
            this._parent = parent;
            this._parentInstance = parentInstance;
            this._context = context;
            this._mountID = _host2.default.mountID++;

            var props = this._currentElement.props;
            var type = this._currentElement.type;
            var instance = {
              _internal: this,
              type: type,
              props: props
            };
            var appendType = props.append; // Default is node

            this._instance = instance;

            // Clone a copy for style diff
            this._prevStyleCopy = Object.assign({}, props.style);

            var nativeNode = this.getNativeNode();

            if (appendType !== TREE) {
              if (childMounter) {
                childMounter(nativeNode, parent);
              } else {
                _host2.default.driver.appendChild(nativeNode, parent);
              }
            }

            if (this._currentElement && this._currentElement.ref) {
              _ref2.default.attach(this._currentElement._owner, this._currentElement.ref, this);
            }

            // Process children
            var children = props.children;
            if (children != null) {
              this.mountChildren(children, context);
            }

            if (appendType === TREE) {
              if (childMounter) {
                childMounter(nativeNode, parent);
              } else {
                _host2.default.driver.appendChild(nativeNode, parent);
              }
            }

            _host2.default.hook.Reconciler.mountComponent(this);

            return instance;
          }
        }, {
          key: 'mountChildren',
          value: function mountChildren(children, context) {
            var _this = this;

            if (!Array.isArray(children)) {
              children = [children];
            }

            var renderedChildren = this._renderedChildren = {};

            var renderedChildrenImage = children.map(function(element, index) {
              var renderedChild = (0, _instantiateComponent2.default)(element);
              var name = (0, _getElementKeyName2.default)(renderedChildren, element, index);
              renderedChildren[name] = renderedChild;
              renderedChild._mountIndex = index;
              // Mount
              var mountImage = renderedChild.mountComponent(_this.getNativeNode(), _this._instance, context, null);
              return mountImage;
            });

            return renderedChildrenImage;
          }
        }, {
          key: 'unmountChildren',
          value: function unmountChildren(notRemoveChild) {
            var renderedChildren = this._renderedChildren;

            if (renderedChildren) {
              for (var name in renderedChildren) {
                var renderedChild = renderedChildren[name];
                renderedChild.unmountComponent(notRemoveChild);
              }
              this._renderedChildren = null;
            }
          }
        }, {
          key: 'unmountComponent',
          value: function unmountComponent(notRemoveChild) {
            if (this._nativeNode) {
              var ref = this._currentElement.ref;
              if (ref) {
                _ref2.default.detach(this._currentElement._owner, ref, this);
              }

              _instance2.default.remove(this._nativeNode);
              if (!notRemoveChild) {
                _host2.default.driver.removeChild(this._nativeNode, this._parent);
              }
              _host2.default.driver.removeAllEventListeners(this._nativeNode);
            }

            this.unmountChildren(notRemoveChild);

            _host2.default.hook.Reconciler.unmountComponent(this);

            this._currentElement = null;
            this._nativeNode = null;
            this._parent = null;
            this._parentInstance = null;
            this._context = null;
            this._instance = null;
            this._prevStyleCopy = null;
          }
        }, {
          key: 'updateComponent',
          value: function updateComponent(prevElement, nextElement, prevContext, nextContext) {
            // Replace current element
            this._currentElement = nextElement;

            _ref2.default.update(prevElement, nextElement, this);

            var prevProps = prevElement.props;
            var nextProps = nextElement.props;

            this.updateProperties(prevProps, nextProps);
            this.updateChildren(nextProps.children, nextContext);

            _host2.default.hook.Reconciler.receiveComponent(this);
          }
        }, {
          key: 'updateProperties',
          value: function updateProperties(prevProps, nextProps) {
            var propKey = void 0;
            var styleName = void 0;
            var styleUpdates = void 0;
            for (propKey in prevProps) {
              if (propKey === CHILDREN || nextProps.hasOwnProperty(propKey) || !prevProps.hasOwnProperty(propKey) || prevProps[propKey] == null) {
                continue;
              }
              if (propKey === STYLE) {
                var lastStyle = this._prevStyleCopy;
                for (styleName in lastStyle) {
                  if (lastStyle.hasOwnProperty(styleName)) {
                    styleUpdates = styleUpdates || {};
                    styleUpdates[styleName] = '';
                  }
                }
                this._prevStyleCopy = null;
              } else if (EVENT_PREFIX_REGEXP.test(propKey)) {
                if (typeof prevProps[propKey] === 'function') {
                  _host2.default.driver.removeEventListener(this.getNativeNode(), propKey.slice(2).toLowerCase(), prevProps[propKey]);
                }
              } else {
                _host2.default.driver.removeAttribute(this.getNativeNode(), propKey, prevProps[propKey]);
              }
            }

            for (propKey in nextProps) {
              var nextProp = nextProps[propKey];
              var prevProp = propKey === STYLE ? this._prevStyleCopy : prevProps != null ? prevProps[propKey] : undefined;
              if (propKey === CHILDREN || !nextProps.hasOwnProperty(propKey) || nextProp === prevProp || nextProp == null && prevProp == null) {
                continue;
              }
              // Update style
              if (propKey === STYLE) {
                if (nextProp) {
                  // Clone property
                  nextProp = this._prevStyleCopy = Object.assign({}, nextProp);
                } else {
                  this._prevStyleCopy = null;
                }

                if (prevProp != null) {
                  // Unset styles on `prevProp` but not on `nextProp`.
                  for (styleName in prevProp) {
                    if (prevProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                      styleUpdates = styleUpdates || {};
                      styleUpdates[styleName] = '';
                    }
                  }
                  // Update styles that changed since `prevProp`.
                  for (styleName in nextProp) {
                    if (nextProp.hasOwnProperty(styleName) && prevProp[styleName] !== nextProp[styleName]) {
                      styleUpdates = styleUpdates || {};
                      styleUpdates[styleName] = nextProp[styleName];
                    }
                  }
                } else {
                  // Assign next prop when prev style is null
                  styleUpdates = nextProp;
                }
              } else if (EVENT_PREFIX_REGEXP.test(propKey)) {
                // Update event binding
                var eventName = propKey.slice(2).toLowerCase();

                if (typeof prevProp === 'function') {
                  _host2.default.driver.removeEventListener(this.getNativeNode(), eventName, prevProp, nextProps);
                }

                if (typeof nextProp === 'function') {
                  _host2.default.driver.addEventListener(this.getNativeNode(), eventName, nextProp, nextProps);
                }
              } else {
                // Update other property
                var payload = {};
                payload[propKey] = nextProp;
                if (nextProp != null) {
                  _host2.default.driver.setAttribute(this.getNativeNode(), propKey, nextProp);
                } else {
                  _host2.default.driver.removeAttribute(this.getNativeNode(), propKey, prevProps[propKey]);
                }
                if (false) { }
              }
            }

            if (styleUpdates) {
              if (false) { }
              _host2.default.driver.setStyles(this.getNativeNode(), styleUpdates);
            }
          }
        }, {
          key: 'updateChildren',
          value: function updateChildren(nextChildrenElements, context) {
            var _this2 = this;

            // prev rendered children
            var prevChildren = this._renderedChildren;

            if (nextChildrenElements == null && prevChildren == null) {
              return;
            }

            var nextChildren = {};
            var oldNodes = {};

            if (nextChildrenElements != null) {
              if (!Array.isArray(nextChildrenElements)) {
                nextChildrenElements = [nextChildrenElements];
              }

              // Update next children elements
              for (var index = 0, length = nextChildrenElements.length; index < length; index++) {
                var nextElement = nextChildrenElements[index];
                var name = (0, _getElementKeyName2.default)(nextChildren, nextElement, index);
                var prevChild = prevChildren && prevChildren[name];
                var prevElement = prevChild && prevChild._currentElement;

                if (prevChild != null && (0, _shouldUpdateComponent2.default)(prevElement, nextElement)) {
                  // Pass the same context when updating chidren
                  prevChild.updateComponent(prevElement, nextElement, context, context);
                  nextChildren[name] = prevChild;
                } else {
                  // Unmount the prevChild when nextChild is different element type.
                  if (prevChild) {
                    var oldNativeNode = prevChild.getNativeNode();
                    // Delay remove child
                    prevChild.unmountComponent(true);
                    oldNodes[name] = oldNativeNode;
                  }
                  // The child must be instantiated before it's mounted.
                  nextChildren[name] = (0, _instantiateComponent2.default)(nextElement);
                }
              }
            }

            var firstPrevChild = void 0;
            var delayRemoveFirstPrevChild = void 0;
            // Unmount children that are no longer present.
            if (prevChildren != null) {
              for (var _name in prevChildren) {
                if (!prevChildren.hasOwnProperty(_name)) {
                  continue;
                }

                var _prevChild = prevChildren[_name];
                var shouldRemove = !nextChildren[_name];

                // Store old first child ref for append node ahead and maybe delay remove it
                if (!firstPrevChild) {
                  firstPrevChild = _prevChild;
                  delayRemoveFirstPrevChild = shouldRemove;
                } else if (shouldRemove) {
                  _prevChild.unmountComponent();
                }
              }
            }

            if (nextChildren != null) {
              (function() {
                // `nextIndex` will increment for each child in `nextChildren`, but
                // `lastIndex` will be the last index visited in `prevChildren`.
                var lastIndex = 0;
                var nextIndex = 0;
                var lastPlacedNode = null;
                var nextNativeNode = [];

                var _loop = function _loop(_name2) {
                  if (!nextChildren.hasOwnProperty(_name2)) {
                    return 'continue';
                  }

                  var nextChild = nextChildren[_name2];
                  var prevChild = prevChildren && prevChildren[_name2];

                  if (prevChild === nextChild) {
                    var prevChildNativeNode = prevChild.getNativeNode();
                    // Convert to array type
                    if (!Array.isArray(prevChildNativeNode)) {
                      prevChildNativeNode = [prevChildNativeNode];
                    }

                    // If the index of `child` is less than `lastIndex`, then it needs to
                    // be moved. Otherwise, we do not need to move it because a child will be
                    // inserted or moved before `child`.
                    if (prevChild._mountIndex < lastIndex) {
                      // Get the last child
                      if (Array.isArray(lastPlacedNode)) {
                        lastPlacedNode = lastPlacedNode[lastPlacedNode.length - 1];
                      }

                      for (var _i = prevChildNativeNode.length - 1; _i >= 0; _i--) {
                        _host2.default.driver.insertAfter(prevChildNativeNode[_i], lastPlacedNode);
                      }
                    }

                    nextNativeNode = nextNativeNode.concat(prevChildNativeNode);

                    lastIndex = Math.max(prevChild._mountIndex, lastIndex);
                    prevChild._mountIndex = nextIndex;
                  } else {
                    if (prevChild != null) {
                      // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
                      lastIndex = Math.max(prevChild._mountIndex, lastIndex);
                    }

                    var parent = _this2.getNativeNode();
                    // Fragment extended native component, so if parent is fragment should get this._parent
                    if (Array.isArray(parent)) {
                      parent = _this2._parent;
                    }

                    nextChild.mountComponent(parent, _this2._instance, context, function(newChild, parent) {
                      // TODO: Rework the duplicate code
                      var oldChild = oldNodes[_name2];
                      if (!Array.isArray(newChild)) {
                        newChild = [newChild];
                      }

                      if (oldChild) {
                        // The oldChild or newChild all maybe fragment
                        if (!Array.isArray(oldChild)) {
                          oldChild = [oldChild];
                        }

                        // If newChild count large then oldChild
                        var lastNewChild = void 0;
                        for (var _i2 = 0; _i2 < newChild.length; _i2++) {
                          var child = newChild[_i2];
                          if (oldChild[_i2]) {
                            _host2.default.driver.replaceChild(child, oldChild[_i2]);
                          } else {
                            _host2.default.driver.insertAfter(child, lastNewChild);
                          }
                          lastNewChild = child;
                        }

                        // If newChild count less then oldChild
                        if (newChild.length < oldChild.length) {
                          for (var _i3 = newChild.length; _i3 < oldChild.length; _i3++) {
                            _host2.default.driver.removeChild(oldChild[_i3]);
                          }
                        }
                      } else {
                        // Insert child at a specific index

                        // Get the last child
                        if (Array.isArray(lastPlacedNode)) {
                          lastPlacedNode = lastPlacedNode[lastPlacedNode.length - 1];
                        }

                        var prevFirstNativeNode = void 0;

                        if (firstPrevChild && !lastPlacedNode) {
                          prevFirstNativeNode = firstPrevChild.getNativeNode();
                          if (Array.isArray(prevFirstNativeNode)) {
                            prevFirstNativeNode = prevFirstNativeNode[0];
                          }
                        }

                        for (var _i4 = newChild.length - 1; _i4 >= 0; _i4--) {
                          var _child = newChild[_i4];
                          if (lastPlacedNode) {
                            _host2.default.driver.insertAfter(_child, lastPlacedNode);
                          } else if (prevFirstNativeNode) {
                            _host2.default.driver.insertBefore(_child, prevFirstNativeNode);
                          } else {
                            _host2.default.driver.appendChild(_child, parent);
                          }
                        }
                      }

                      nextNativeNode = nextNativeNode.concat(newChild);
                    });
                    nextChild._mountIndex = nextIndex;
                  }

                  nextIndex++;
                  lastPlacedNode = nextChild.getNativeNode();
                };

                for (var _name2 in nextChildren) {
                  var _ret2 = _loop(_name2);

                  if (_ret2 === 'continue') continue;
                }

                // Sync update native refs
                if (Array.isArray(_this2._nativeNode)) {
                  // Clear all and push the new array
                  _this2._nativeNode.splice(0, _this2._nativeNode.length);
                  for (var i = 0; i < nextNativeNode.length; i++) {
                    _this2._nativeNode.push(nextNativeNode[i]);
                  }
                }
              })();
            }

            if (delayRemoveFirstPrevChild) {
              firstPrevChild.unmountComponent();
            }

            this._renderedChildren = nextChildren;
          }
        }, {
          key: 'getNativeNode',
          value: function getNativeNode() {
            if (this._nativeNode == null) {
              this._nativeNode = _host2.default.driver.createElement(this._instance);
              _instance2.default.set(this._nativeNode, this._instance);
            }

            return this._nativeNode;
          }
        }, {
          key: 'getPublicInstance',
          value: function getPublicInstance() {
            return this.getNativeNode();
          }
        }, {
          key: 'getName',
          value: function getName() {
            return this._currentElement.type;
          }
        }]);

        return NativeComponent;
      }();

      exports.default = NativeComponent;
      module.exports = exports.default;

      /***/
    },
    /* 13 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      /*
         * Current PropTypes only export some api with react, not validate in runtime.
         */

      function createChainableTypeChecker(validate) {
        function checkType(isRequired, props, propName, componentName, location, propFullName) {
          return typeChecker;
        }

        var chainedCheckType = checkType.bind(null, false);
        chainedCheckType.isRequired = checkType.bind(null, true);

        return chainedCheckType;
      }

      function createTypeChecker(expectedType) {
        function validate(props, propName, componentName, location, propFullName) {
          // Noop
        }
        return createChainableTypeChecker(validate);
      }

      var typeChecker = createTypeChecker();

      exports.default = {
        array: typeChecker,
        bool: typeChecker,
        func: typeChecker,
        number: typeChecker,
        object: typeChecker,
        string: typeChecker,
        symbol: typeChecker,
        element: typeChecker,
        node: typeChecker,
        any: typeChecker,
        arrayOf: typeChecker,
        instanceOf: typeChecker,
        objectOf: typeChecker,
        oneOf: typeChecker,
        oneOfType: typeChecker,
        shape: typeChecker
      };
      module.exports = exports.default;

      /***/
    },
    /* 14 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      var _typeof2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol' ? function(obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };

        // https://www.w3.org/TR/html5/webappapis.html#dom-navigator-appcodename
      var isWeb = exports.isWeb = (typeof navigator === 'undefined' ? 'undefined' : _typeof(navigator)) === 'object' && (navigator.appCodeName === 'Mozilla' || navigator.product === 'Gecko');
      var isNode = exports.isNode = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
      var isWeex = exports.isWeex = typeof callNative === 'function' || (typeof WXEnvironment === 'undefined' ? 'undefined' : _typeof(WXEnvironment)) === 'object' && WXEnvironment.platform !== 'Web';
      var isReactNative = exports.isReactNative = typeof __fbBatchedBridgeConfig !== 'undefined';
      exports.default = module.exports;
      exports.default = module.exports;

      /***/
    },
    /* 15 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = flattenChildren;
      function traverseChildren(children, result) {
        if (Array.isArray(children)) {
          for (var i = 0, l = children.length; i < l; i++) {
            traverseChildren(children[i], result);
          }
        } else {
          result.push(children);
        }
      }

      function flattenChildren(children) {
        if (children == null) {
          return children;
        }
        var result = [];
        traverseChildren(children, result);

        if (result.length === 1) {
          result = result[0];
        }

        return result;
      }
      module.exports = exports.default;

      /***/
    },
    /* 16 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _instance = __webpack_require__(1);

      var _instance2 = _interopRequireDefault(_instance);

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = {
        ComponentTree: {
          getClosestInstanceFromNode: function getClosestInstanceFromNode(node) {
            return _instance2.default.get(node);
          },
          getNodeFromInstance: function getNodeFromInstance(inst) {
            // inst is an internal instance (but could be a composite)
            while (inst._renderedComponent) {
              inst = inst._renderedComponent;
            }

            if (inst) {
              return inst._nativeNode;
            } else {
              return null;
            }
          }
        },
        Mount: {
          _instancesByReactRootID: _host2.default.rootComponents,

          // Stub - React DevTools expects to find this method and replace it
          // with a wrapper in order to observe new root components being added
          _renderNewRootComponent: function _renderNewRootComponent() { }
        },
        Reconciler: {
          // Stubs - React DevTools expects to find these methods and replace them
          // with wrappers in order to observe components being mounted, updated and
          // unmounted
          mountComponent: function mountComponent() { },
          receiveComponent: function receiveComponent() { },
          unmountComponent: function unmountComponent() { }
        },
        // monitor the info of all components
        monitor: null
      };
      module.exports = exports.default;

      /***/
    },
    /* 17 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      exports.default = createContext;

      var _component = __webpack_require__(2);

      var _component2 = _interopRequireDefault(_component);

      var _proptypes = __webpack_require__(13);

      var _proptypes2 = _interopRequireDefault(_proptypes);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        } return obj;
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        } return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      var ValueEmitter = function() {
        function ValueEmitter(defaultValue) {
          _classCallCheck(this, ValueEmitter);

          this.handlers = [];
          this.value = defaultValue;
        }

        _createClass(ValueEmitter, [{
          key: 'on',
          value: function on(handler) {
            this.handlers.push(handler);
          }
        }, {
          key: 'off',
          value: function off(handler) {
            this.handlers = this.handlers.filter(function(h) {
              return h !== handler;
            });
          }
        }, {
          key: 'emit',
          value: function emit(value) {
            this.value = value;
            this.handlers.forEach(function(handler) {
              return handler(value);
            });
          }
        }]);

        return ValueEmitter;
      }();

      var uniqueId = 0;

      function createContext(defaultValue) {
        var contextProp = '__context_' + uniqueId++ + '__';

        var Provider = function(_Component) {
          _inherits(Provider, _Component);

          function Provider() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, Provider);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Provider.__proto__ || Object.getPrototypeOf(Provider)).call.apply(_ref, [this].concat(args))), _this), _this.emitter = new ValueEmitter(defaultValue), _temp), _possibleConstructorReturn(_this, _ret);
          }

          _createClass(Provider, [{
            key: 'getChildContext',
            value: function getChildContext() {
              return _defineProperty({}, contextProp, this.emitter);
            }
          }, {
            key: 'componentWillMount',
            value: function componentWillMount() {
              if (this.props.value !== undefined) {
                this.emitter.value = this.props.value;
              }
            }
          }, {
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
              if (this.props.value !== nextProps.value) {
                this.emitter.emit(nextProps.value);
              }
            }
          }, {
            key: 'render',
            value: function render() {
              return this.props.children;
            }
          }]);

          return Provider;
        }(_component2.default);

        Provider.childContextTypes = _defineProperty({}, contextProp, _proptypes2.default.object);

        var Consumer = function(_Component2) {
          _inherits(Consumer, _Component2);

          function Consumer() {
            var _ref3;

            var _temp2, _this2, _ret2;

            _classCallCheck(this, Consumer);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return _ret2 = (_temp2 = (_this2 = _possibleConstructorReturn(this, (_ref3 = Consumer.__proto__ || Object.getPrototypeOf(Consumer)).call.apply(_ref3, [this].concat(args))), _this2), _this2.state = {
              value: _this2.context[contextProp] ? _this2.context[contextProp].value : defaultValue
            }, _this2.onUpdate = function(value) {
              return _this2.setState({ value: value });
            }, _temp2), _possibleConstructorReturn(_this2, _ret2);
          }

          _createClass(Consumer, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
              if (this.context[contextProp]) {
                this.context[contextProp].on(this.onUpdate);
              }
            }
          }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              if (this.context[contextProp]) {
                this.context[contextProp].off(this.onUpdate);
              }
            }
          }, {
            key: 'render',
            value: function render() {
              var children = this.props.children;
              var consumer = Array.isArray(children) ? children[0] : children;
              if (typeof consumer === 'function') {
                return consumer(this.state.value);
              }
            }
          }]);

          return Consumer;
        }(_component2.default);

        Consumer.contextTypes = _defineProperty({}, contextProp, _proptypes2.default.object);


        return {
          Provider: Provider,
          Consumer: Consumer
        };
      }
      module.exports = exports.default;

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _flattenChildren = __webpack_require__(15);

      var _flattenChildren2 = _interopRequireDefault(_flattenChildren);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function convertChildrenToArray(children) {
        // flatten children
        children = (0, _flattenChildren2.default)(children, []);
        return Array.isArray(children) ? children : [].concat(children);
      }

      var Children = {
        map: function map(children, fn, ctx) {
          if (children == null) return null;
          children = convertChildrenToArray(children);
          return children.map(function(child, index) {
            return fn.call(ctx, child, index);
          });
        },
        forEach: function forEach(children, fn, ctx) {
          if (children == null) return null;
          children = convertChildrenToArray(children);
          children.forEach(function(child, index) {
            return fn.call(ctx, child, index);
          });
        },
        count: function count(children) {
          if (children == null) return 0;
          return convertChildrenToArray(children).length;
        },
        only: function only(children) {
          // `only` receive rax element child
          // null value is not acceptable
          children = Children.toArray(children);
          if (children.length !== 1) throw new Error('Children.only: expected to receive a single element child.');
          return children[0];
        },
        toArray: function toArray(children) {
          if (children == null) return [];
          // `toArray` filter null value
          return convertChildrenToArray(children).filter(function(child) {
            return child !== null;
          });
        }
      };

      exports.default = Children;
      module.exports = exports.default;

      /***/
    },
    /* 19 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = '0.6.4';
      module.exports = exports.default;

      /***/
    },
    /* 20 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = setNativeProps;

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _findDOMNode = __webpack_require__(8);

      var _findDOMNode2 = _interopRequireDefault(_findDOMNode);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function setNativeProps(node, props) {
        node = (0, _findDOMNode2.default)(node);
        _host2.default.driver.setNativeProps(node, props);
      }
      module.exports = exports.default;

      /***/
    },
    /* 21 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _instance = __webpack_require__(1);

      var _instance2 = _interopRequireDefault(_instance);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function findComponentInstance(node) {
        if (node == null) {
          return null;
        }
        return _instance2.default.get(node);
      }

      exports.default = findComponentInstance;
      module.exports = exports.default;

      /***/
    },
    /* 22 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      exports.default = createPortal;

      var _component = __webpack_require__(2);

      var _component2 = _interopRequireDefault(_component);

      var _render = __webpack_require__(4);

      var _render2 = _interopRequireDefault(_render);

      var _unmountComponentAtNode = __webpack_require__(6);

      var _unmountComponentAtNode2 = _interopRequireDefault(_unmountComponentAtNode);

      var _element = __webpack_require__(7);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        } return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }

      var Portal = function(_Component) {
        _inherits(Portal, _Component);

        function Portal(props, context) {
          _classCallCheck(this, Portal);

          return _possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).call(this, props, context));
        }

        _createClass(Portal, [{
          key: 'componentDidMount',
          value: function componentDidMount() {
            this.renderPortal();
          }
        }, {
          key: 'componentDidUpdate',
          value: function componentDidUpdate(prevProps) {
            if (prevProps.container !== this.props.container) {
              (0, _unmountComponentAtNode2.default)(prevProps.container);
            }

            this.renderPortal();
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            (0, _unmountComponentAtNode2.default)(this.props.container);
          }
        }, {
          key: 'renderPortal',
          value: function renderPortal() {
            (0, _render2.default)(this.props.element, this.props.container, {
              parent: this
            });
          }
        }, {
          key: 'render',
          value: function render() {
            return null;
          }
        }]);

        return Portal;
      }(_component2.default);

      function createPortal(element, container) {
        return (0, _element.createElement)(Portal, {
          element: element,
          container: container
        });
      }
      module.exports = exports.default;

      /***/
    },
    /* 23 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _render = __webpack_require__(4);

      var _render2 = _interopRequireDefault(_render);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
          } return arr2;
        } else {
          return Array.from(arr);
        }
      }

      function hydrate(element, container, options, callback) {
        // Handle server rendered element
        if (container.childNodes) {
          // Clone childNodes, Because removeChild will causing change in childNodes length
          var childNodes = [].concat(_toConsumableArray(container.childNodes));

          for (var i = 0; i < childNodes.length; i++) {
            var rootChildNode = childNodes[i];
            container.removeChild(rootChildNode);
          }
        }

        return (0, _render2.default)(element, container, options, callback); ;
      }

      exports.default = hydrate;
      module.exports = exports.default;

      /***/
    },
    /* 24 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      var BOX_ALIGN = {
        stretch: 'stretch',
        'flex-start': 'start',
        'flex-end': 'end',
        center: 'center'
      };

      var BOX_ORIENT = {
        row: 'horizontal',
        column: 'vertical'
      };

      var BOX_PACK = {
        'flex-start': 'start',
        'flex-end': 'end',
        center: 'center',
        'space-between': 'justify',
        'space-around': 'justify' // Just same as `space-between`
      };

      var FLEX_PROPS = {
        display: true,
        flex: true,
        alignItems: true,
        alignSelf: true,
        flexDirection: true,
        justifyContent: true,
        flexWrap: true
      };

      var Flexbox = {
        isFlexProp: function isFlexProp(prop) {
          return FLEX_PROPS[prop];
        },
        display: function display(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if (value === 'flex') {
            style.display = ['-webkit-box', '-webkit-flex', 'flex'];
          } else {
            style.display = value;
          }

          return style;
        },
        flex: function flex(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          style.webkitBoxFlex = value;
          style.webkitFlex = value;
          style.flex = value;
          return style;
        },
        flexWrap: function flexWrap(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          style.webkitFlexWrap = value;
          style.flexWrap = value;
          return style;
        },
        alignItems: function alignItems(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          style.webkitBoxAlign = BOX_ALIGN[value];
          style.webkitAlignItems = value;
          style.alignItems = value;
          return style;
        },
        alignSelf: function alignSelf(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          style.webkitAlignSelf = value;
          style.alignSelf = value;
          return style;
        },
        flexDirection: function flexDirection(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          style.webkitBoxOrient = BOX_ORIENT[value];
          style.webkitFlexDirection = value;
          style.flexDirection = value;
          return style;
        },
        justifyContent: function justifyContent(value) {
          var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          style.webkitBoxPack = BOX_PACK[value];
          style.webkitJustifyContent = value;
          style.justifyContent = value;
          return style;
        }
      };

      exports.default = Flexbox;
      module.exports = exports.default;

      /***/
    },
    /* 25 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      exports.isRem = isRem;
      exports.calcRem = calcRem;
      exports.getRem = getRem;
      exports.setRem = setRem;
      exports.isUnitNumber = isUnitNumber;
      exports.convertUnit = convertUnit;
      /**
         * CSS properties which accept numbers but are not in units of "px".
         */
      var UNITLESS_NUMBER_PROPS = {
        animationIterationCount: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridRow: true,
        gridColumn: true,
        fontWeight: true,
        lineClamp: true,
        // We make lineHeight default is px that is diff with w3c spec
        // lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        // Weex only
        lines: true
      };
      var SUFFIX = 'rem';
      var REM_REG = /[-+]?\d*\.?\d+rem/g;
      var GLOBAL_REM_UNIT = '__global_rem_unit__';
      var global = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : {};
      // Default 1 rem to 1 px
      if (global[GLOBAL_REM_UNIT] == null) {
        global[GLOBAL_REM_UNIT] = 1;
      }

      /**
         * Is string contains rem
         * @param {String} str
         * @returns {Boolean}
         */
      function isRem(str) {
        return typeof str === 'string' && str.indexOf(SUFFIX) !== -1;
      }

      /**
         * Calculate rem to pixels: '1.2rem' => 1.2 * rem
         * @param {String} str
         * @param {Number} rem
         * @returns {number}
         */
      function calcRem(str) {
        var remUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : global[GLOBAL_REM_UNIT];

        return str.replace(REM_REG, function(rem) {
          return parseFloat(rem) * remUnit + 'px';
        });
      }

      function getRem() {
        return global[GLOBAL_REM_UNIT];
      }

      function setRem(rem) {
        global[GLOBAL_REM_UNIT] = rem;
      }

      function isUnitNumber(val, prop) {
        return typeof val === 'number' && !UNITLESS_NUMBER_PROPS[prop];
      }

      function convertUnit(val, prop) {
        var remUnit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : global[GLOBAL_REM_UNIT];

        if (prop && isUnitNumber(val, prop)) {
          return val * remUnit + 'px';
        } else if (isRem(val)) {
          return calcRem(val, remUnit);
        }

        return val;
      }
      exports.default = module.exports;
      exports.default = module.exports;

      /***/
    },
    /* 26 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      var _typeof2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol' ? function(obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      }; /**
      * Web Browser driver
      **/

        /* global DEVICE_WIDTH, VIEWPORT_WIDTH */

      var _styleUnit = __webpack_require__(25);

      var _flexbox = __webpack_require__(24);

      var _flexbox2 = _interopRequireDefault(_flexbox);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
      var CLASS_NAME = 'className';
      var CLASS = 'class';
      var STYLE = 'style';
      var CHILDREN = 'children';
      var EVENT_PREFIX_REGEXP = /^on[A-Z]/;

      var ADD_EVENT = 'addEvent';
      var REMOVE_EVENT = 'removeEvent';
      var TEXT_CONTENT_ATTR = (typeof document === 'undefined' ? 'undefined' : _typeof(document)) === 'object' && 'textContent' in document ? 'textContent' : 'nodeValue';

      var SVG_NS = 'http://www.w3.org/2000/svg';
      var SVG_TAG_LIST = ['svg', 'circle', 'ellipse', 'line', 'rect', 'polygon', 'polyline', 'path', 'text', 'defs', 'stop', 'linearGradient', 'radialGradient', 'textPath', 'use', 'g', 'tspan', 'tref', 'clipPath'];

      var Driver = {

        deviceWidth: typeof DEVICE_WIDTH !== 'undefined' && DEVICE_WIDTH || null,
        viewportWidth: typeof VIEWPORT_WIDTH !== 'undefined' && VIEWPORT_WIDTH || 750,
        eventRegistry: {},

        getDeviceWidth: function getDeviceWidth() {
          return this.deviceWidth || document.documentElement.clientWidth;
        },
        setDeviceWidth: function setDeviceWidth(width) {
          this.deviceWidth = width;
        },
        getViewportWidth: function getViewportWidth() {
          return this.viewportWidth;
        },
        setViewportWidth: function setViewportWidth(width) {
          this.viewportWidth = width;
        },
        getElementById: function getElementById(id) {
          return document.getElementById(id);
        },
        createBody: function createBody() {
          return document.body;
        },
        createComment: function createComment(content) {
          return document.createComment(content);
        },
        createEmpty: function createEmpty() {
          return this.createComment(' empty ');
        },
        createText: function createText(text) {
          return document.createTextNode(text);
        },
        updateText: function updateText(node, text) {
          node[TEXT_CONTENT_ATTR] = text;
        },
        createElement: function createElement(component) {
          var node = void 0;
          if (component && SVG_TAG_LIST.indexOf(component.type) > -1) {
            node = document.createElementNS(SVG_NS, component.type);
          } else {
            node = document.createElement(component.type);
          }
          var props = component.props;

          this.setNativeProps(node, props);

          return node;
        },
        appendChild: function appendChild(node, parent) {
          return parent.appendChild(node);
        },
        removeChild: function removeChild(node, parent) {
          parent = parent || node.parentNode;
          // Maybe has been removed when remove child
          if (parent) {
            parent.removeChild(node);
          }
        },
        replaceChild: function replaceChild(newChild, oldChild, parent) {
          parent = parent || oldChild.parentNode;
          parent.replaceChild(newChild, oldChild);
        },
        insertAfter: function insertAfter(node, after, parent) {
          parent = parent || after.parentNode;
          var nextSibling = after.nextSibling;
          if (nextSibling) {
            parent.insertBefore(node, nextSibling);
          } else {
            parent.appendChild(node);
          }
        },
        insertBefore: function insertBefore(node, before, parent) {
          parent = parent || before.parentNode;
          parent.insertBefore(node, before);
        },
        addEventListener: function addEventListener(node, eventName, eventHandler, props) {
          if (this.eventRegistry[eventName]) {
            return this.eventRegistry[eventName](ADD_EVENT, node, eventName, eventHandler, props);
          } else {
            return node.addEventListener(eventName, eventHandler);
          }
        },
        removeEventListener: function removeEventListener(node, eventName, eventHandler, props) {
          if (this.eventRegistry[eventName]) {
            return this.eventRegistry[eventName](REMOVE_EVENT, node, eventName, eventHandler, props);
          } else {
            return node.removeEventListener(eventName, eventHandler);
          }
        },
        removeAllEventListeners: function removeAllEventListeners(node) {
          // noop
        },
        removeAttribute: function removeAttribute(node, propKey) {
          if (propKey === DANGEROUSLY_SET_INNER_HTML) {
            return node.innerHTML = null;
          }

          if (propKey === CLASS_NAME) {
            propKey = CLASS;
          }

          if (propKey in node) {
            try {
              // Some node property is readonly when in strict mode
              node[propKey] = null;
            } catch (e) { }
          }

          node.removeAttribute(propKey);
        },
        setAttribute: function setAttribute(node, propKey, propValue) {
          if (propKey === DANGEROUSLY_SET_INNER_HTML) {
            return node.innerHTML = propValue.__html;
          }

          if (propKey === CLASS_NAME) {
            propKey = CLASS;
          }

          if (propKey in node) {
            try {
              // Some node property is readonly when in strict mode
              node[propKey] = propValue;
            } catch (e) {
              node.setAttribute(propKey, propValue);
            }
          } else {
            node.setAttribute(propKey, propValue);
          }
        },
        setStyles: function setStyles(node, styles) {
          var tranformedStyles = {};

          for (var prop in styles) {
            var val = styles[prop];
            if (_flexbox2.default.isFlexProp(prop)) {
              _flexbox2.default[prop](val, tranformedStyles);
            } else {
              tranformedStyles[prop] = (0, _styleUnit.convertUnit)(val, prop);
            }
          }

          for (var _prop in tranformedStyles) {
            var transformValue = tranformedStyles[_prop];
            // hack handle compatibility issue
            if (Array.isArray(transformValue)) {
              for (var i = 0; i < transformValue.length; i++) {
                node.style[_prop] = transformValue[i];
              }
            } else {
              node.style[_prop] = transformValue;
            }
          }
        },
        beforeRender: function beforeRender() {
          // Init rem unit
          (0, _styleUnit.setRem)(this.getDeviceWidth() / this.getViewportWidth());
        },
        setNativeProps: function setNativeProps(node, props) {
          for (var prop in props) {
            var value = props[prop];
            if (prop === CHILDREN) {
              continue;
            }

            if (value != null) {
              if (prop === STYLE) {
                this.setStyles(node, value);
              } else if (EVENT_PREFIX_REGEXP.test(prop)) {
                var eventName = prop.slice(2).toLowerCase();
                this.addEventListener(node, eventName, value);
              } else {
                this.setAttribute(node, prop, value);
              }
            }
          }
        }
      };

      exports.default = Driver;
      module.exports = exports.default;

      /***/
    },
    /* 27 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = {

        /**
           * parse w3c attrs to weex module attrs
           *
           * @param {Object} w3c component data
           * @return {Object} weex component data
           */
        parse: function parse(component) {
          component.type = 'div';
          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 28 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i]; for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        } return target;
      };

      var BASE_FONT_SIZE = 28;

      function generateHeadingStyle(baseFontSize, fontMultiplier, marginMultiplier) {
        return {
          fontSize: baseFontSize * fontMultiplier,
          marginTop: baseFontSize * fontMultiplier * marginMultiplier,
          marginBottom: baseFontSize * fontMultiplier * marginMultiplier,
          fontWeight: 'bold'
        };
      }

      var HeadingElements = {
        h1: generateHeadingStyle(BASE_FONT_SIZE, 2, 0.67),
        h2: generateHeadingStyle(BASE_FONT_SIZE, 1.5, 0.83),
        h3: generateHeadingStyle(BASE_FONT_SIZE, 1.17, 1),
        h4: generateHeadingStyle(BASE_FONT_SIZE, 1, 1.33),
        h5: generateHeadingStyle(BASE_FONT_SIZE, 0.83, 1.67),
        h6: generateHeadingStyle(BASE_FONT_SIZE, 0.67, 2.33)
      };

      exports.default = {
        parse: function parse(component) {
          var type = component.type,
            props = component.props;

          component.type = 'text';
          props.style = _extends({}, HeadingElements[type] || HeadingElements.h6, props.style);

          if (typeof props.children === 'string' && !props.value) {
            props.value = props.children;
            props.children = null;
          }

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 29 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i]; for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        } return target;
      };

        /**
         * weex button
         *
         * props: disabled, style
         */

      exports.default = {
        parse: function parse(component) {
          var props = component.props;

          component.type = 'text';

          var style = props.style,
            disabled = props.disabled,
            children = props.children;

          var textStyle = _extends({
            textAlign: 'center',
            fontSize: 22,
            paddingTop: 4,
            paddingRight: 12,
            paddingBottom: 6,
            paddingLeft: 12,
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: '#000000',
            backgroudColor: '#c0c0c0'
          }, style);

          if (disabled) {
            props.onClick = null;
            textStyle = _extends({}, textStyle, {
              color: '#7f7f7f',
              borderColor: '#7f7f7f'
            });
          }

          if (typeof children === 'string') {
            props.value = children;
            props.children = null;
          }

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 30 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      var _typeof2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol' ? function(obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };

      var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i]; for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        } return target;
      };

      var BASE_FONT_SIZE = 28;

      var defaultParagraphStyle = {
        fontSize: BASE_FONT_SIZE,
        marginTop: BASE_FONT_SIZE,
        marginBottom: BASE_FONT_SIZE
      };

      var TypographyElements = {
        u: {
          textDecoration: 'underline'
        },
        s: {
          textDecoration: 'line-through'
        },
        i: {
          fontStyle: 'italic'
        },
        b: {
          fontWeight: 'bold'
        },
        del: {
          textDecoration: 'line-through'
        },
        em: {
          fontStyle: 'italic'
        },
        strong: {
          fontWeight: 'bold'
        },
        big: {
          fontSize: BASE_FONT_SIZE * 1.2
        },
        small: {
          fontSize: BASE_FONT_SIZE * 0.8
        }
      };

      function transformString(string) {
        return {
          type: 'span',
          attr: {
            value: string
          }
        };
      }

      function transformChild(child) {
        var type = child.type;
        var props = child.props;
        var style = props.style;
        var nestedChildren = props.children;
        // Alias img tag
        if (type === 'img') {
          type = 'image';
        }

        // Transfrom to span
        if (TypographyElements[type]) {
          style = _extends({}, TypographyElements[type], style);
          type = 'span';
        }

        props.style = null;
        props.children = null;

        var element = {
          type: type,
          style: style,
          attr: props || {}
        };

        if (nestedChildren) {
          if (type === 'span' && typeof nestedChildren === 'string') {
            element.attr.value = nestedChildren;
          } else {
            element.children = transformChildren(nestedChildren);
          }
        }

        return element;
      }

      function transformChildren(children) {
        var elements = [];
        if (!Array.isArray(children)) {
          children = [children];
        }

        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          if (typeof child === 'string') {
            elements.push(transformString(child));
          } else if ((typeof child === 'undefined' ? 'undefined' : _typeof(child)) === 'object') {
            elements.push(transformChild(child));
          }
        }

        return elements;
      }

      exports.default = {
        parse: function parse(component) {
          var props = component.props;

          var children = props.children;

          component.type = 'richtext';

          props.style = _extends({}, defaultParagraphStyle, props.style);

          props.value = transformChildren(children); ;
          props.children = null;

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 31 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = {
        parse: function parse(component) {
          var props = component.props;

          component.type = 'text';

          if (typeof props.children === 'string' && !props.value) {
            props.value = props.children;
            props.children = null;
          }

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 32 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = {

        /**
           * parse w3c attrs to weex module attrs
           *
           * @param {Object} w3c component data
           * @return {Object} weex component data
           */
        parse: function parse(component) {
          var props = component.props;

          if (typeof props.children === 'string' && !props.value) {
            props.value = props.children;
            props.children = null;
          }

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 33 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _parseProps = __webpack_require__(9);

      exports.default = {

        /**
           * parse w3c attrs to weex module attrs
           *
           * @param {Object} w3c component data
           * @return {Object} weex component data
           */
        parse: function parse(component) {
          var props = component.props;

          // modify props

          component.props = (0, _parseProps.transformPropsAttrsToStyle)(props, ['width', 'height']);

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 34 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _parseProps = __webpack_require__(9);

      exports.default = {

        /**
           * parse w3c attrs to weex module attrs
           *
           * @param {Object} w3c component data
           * @return {Object} weex component data
           */
        parse: function parse(component) {
          var props = component.props;

          component.type = 'image';

          // modify props
          component.props = (0, _parseProps.transformPropsAttrsToStyle)(props, ['width', 'height']);

          return component;
        }
      };
      module.exports = exports.default;

      /***/
    },
    /* 35 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _img = __webpack_require__(34);

      var _img2 = _interopRequireDefault(_img);

      var _video = __webpack_require__(33);

      var _video2 = _interopRequireDefault(_video);

      var _textarea = __webpack_require__(32);

      var _textarea2 = _interopRequireDefault(_textarea);

      var _span = __webpack_require__(31);

      var _span2 = _interopRequireDefault(_span);

      var _p = __webpack_require__(30);

      var _p2 = _interopRequireDefault(_p);

      var _button = __webpack_require__(29);

      var _button2 = _interopRequireDefault(_button);

      var _heading = __webpack_require__(28);

      var _heading2 = _interopRequireDefault(_heading);

      var _block = __webpack_require__(27);

      var _block2 = _interopRequireDefault(_block);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.default = {
        span: _span2.default,
        p: _p2.default,
        img: _img2.default,
        button: _button2.default,
        video: _video2.default,
        textarea: _textarea2.default,
        h1: _heading2.default,
        h2: _heading2.default,
        h3: _heading2.default,
        h4: _heading2.default,
        h5: _heading2.default,
        h6: _heading2.default,
        nav: _block2.default,
        article: _block2.default,
        section: _block2.default,
        // Conflict with weex header tag
        // header: block,
        footer: _block2.default,
        aside: _block2.default,
        main: _block2.default
      };
      module.exports = exports.default;

      /***/
    },
    /* 36 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      exports.isRem = isRem;
      exports.calcRem = calcRem;
      exports.getRem = getRem;
      exports.setRem = setRem;
      exports.isUnitNumber = isUnitNumber;
      exports.convertUnit = convertUnit;
      /**
         * CSS properties which accept numbers but are not in units of "px".
         */
      var UNITLESS_NUMBER_PROPS = {
        animationIterationCount: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridRow: true,
        gridColumn: true,
        fontWeight: true,
        lineClamp: true,
        // We make lineHeight default is px that is diff with w3c spec
        // lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        // Weex only
        lines: true
      };
      var SUFFIX = 'rem';
      var REM_REG = /[-+]?\d*\.?\d+rem/g;
      var GLOBAL_REM_UNIT = '__global_rem_unit__';
      var global = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : {};
      // Default 1 rem to 1 px
      if (global[GLOBAL_REM_UNIT] == null) {
        global[GLOBAL_REM_UNIT] = 1;
      }

      /**
         * Is string contains rem
         * @param {String} str
         * @returns {Boolean}
         */
      function isRem(str) {
        return typeof str === 'string' && str.indexOf(SUFFIX) !== -1;
      }

      /**
         * Calculate rem to pixels: '1.2rem' => 1.2 * rem
         * @param {String} str
         * @param {Number} rem
         * @returns {number}
         */
      function calcRem(str) {
        var remUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : global[GLOBAL_REM_UNIT];

        return str.replace(REM_REG, function(rem) {
          return parseFloat(rem) * remUnit + 'px';
        });
      }

      function getRem() {
        return global[GLOBAL_REM_UNIT];
      }

      function setRem(rem) {
        global[GLOBAL_REM_UNIT] = rem;
      }

      function isUnitNumber(val, prop) {
        return typeof val === 'number' && !UNITLESS_NUMBER_PROPS[prop];
      }

      function convertUnit(val, prop) {
        var remUnit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : global[GLOBAL_REM_UNIT];

        if (prop && isUnitNumber(val, prop)) {
          return val * remUnit + 'px';
        } else if (isRem(val)) {
          return calcRem(val, remUnit);
        }

        return val;
      }
      exports.default = module.exports;
      exports.default = module.exports;

      /***/
    },
    /* 37 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      var _typeof2 = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol' ? function(obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      }; /**
      * Weex driver
      */

      var _styleUnit = __webpack_require__(36);

      var _elements = __webpack_require__(35);

      var _elements2 = _interopRequireDefault(_elements);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var STYLE = 'style';
      var ID = 'id';
      var TEXT = 'text';
      var CHILDREN = 'children';
      var EVENT_PREFIX_REGEXP = /^on[A-Z]/;
      var ARIA_PREFIX_REGEXP = /^aria-/;

      var nodeMaps = {};
      /* global __weex_document__ */
      var document = (typeof __weex_document__ === 'undefined' ? 'undefined' : _typeof(__weex_document__)) === 'object' ? __weex_document__ : (typeof document === 'undefined' ? 'undefined' : _typeof(document)) === 'object' ? document : null;

      var Driver = {
        deviceWidth: 750,
        viewportWidth: 750,

        getDeviceWidth: function getDeviceWidth() {
          return this.deviceWidth;
        },
        setDeviceWidth: function setDeviceWidth(width) {
          this.deviceWidth = width;
        },
        getViewportWidth: function getViewportWidth() {
          return this.viewportWidth;
        },
        setViewportWidth: function setViewportWidth(width) {
          this.viewportWidth = width;
        },
        getElementById: function getElementById(id) {
          return nodeMaps[id];
        },
        createBody: function createBody() {
          if (document.body) {
            return document.body;
          }

          var documentElement = document.documentElement;
          var body = document.createBody(Driver.bodyType, Driver.bodyProps);
          documentElement.appendChild(body);

          return body;
        },
        createComment: function createComment(content) {
          return document.createComment(content);
        },
        createEmpty: function createEmpty() {
          return this.createComment(' empty ');
        },
        createText: function createText(text) {
          return Driver.createElement({
            type: TEXT,
            props: {
              value: text
            }
          });
        },
        updateText: function updateText(node, content) {
          this.setAttribute(node, 'value', content);
        },
        createElement: function createElement(component) {
          var htmlElement = _elements2.default[component.type];
          if (htmlElement) {
            component = htmlElement.parse(component);
          }

          var props = component.props;
          var events = [];
          var style = {};
          var originStyle = props[STYLE];
          for (var prop in originStyle) {
            style[prop] = (0, _styleUnit.convertUnit)(originStyle[prop], prop);
          }

          var node = document.createElement(component.type, {
            style: style
          });

          this.setNativeProps(node, props, true);

          return node;
        },
        appendChild: function appendChild(node, parent) {
          return parent.appendChild(node);
        },
        removeChild: function removeChild(node, parent) {
          parent = parent || node.parentNode;
          var id = node.attr && node.attr[ID];
          if (id != null) {
            nodeMaps[id] = null;
          }
          return parent.removeChild(node);
        },
        replaceChild: function replaceChild(newChild, oldChild, parent) {
          parent = parent || oldChild.parentNode;
          var previousSibling = oldChild.previousSibling;
          var nextSibling = oldChild.nextSibling;
          this.removeChild(oldChild, parent);

          if (previousSibling) {
            this.insertAfter(newChild, previousSibling, parent);
          } else if (nextSibling) {
            this.insertBefore(newChild, nextSibling, parent);
          } else {
            this.appendChild(newChild, parent);
          }
        },
        insertAfter: function insertAfter(node, after, parent) {
          parent = parent || after.parentNode;
          return parent.insertAfter(node, after);
        },
        insertBefore: function insertBefore(node, before, parent) {
          parent = parent || before.parentNode;
          return parent.insertBefore(node, before);
        },
        addEventListener: function addEventListener(node, eventName, eventHandler, props) {
          var params = props[eventName + 'EventParams'];
          return node.addEvent(eventName, eventHandler, params);
        },
        removeEventListener: function removeEventListener(node, eventName, eventHandler) {
          return node.removeEvent(eventName, eventHandler);
        },
        removeAllEventListeners: function removeAllEventListeners(node) {
          // Noop
        },
        removeAttribute: function removeAttribute(node, propKey, propValue) {
          if (propKey == ID) {
            nodeMaps[propValue] = null;
          }
          // Weex native will crash when pass null value
          return node.setAttr(propKey, undefined, false);
        },
        setAttribute: function setAttribute(node, propKey, propValue) {
          if (propKey == ID) {
            nodeMaps[propValue] = node;
          }

          // Weex only support `ariaLabel` format, convert `aria-label` format to camelcase
          if (ARIA_PREFIX_REGEXP.test(propKey)) {
            propKey = propKey.replace(/\-(\w)/, function(m, p1) {
              return p1.toUpperCase();
            });
          }

          return node.setAttr(propKey, propValue, false);
        },
        setStyles: function setStyles(node, styles) {
          // TODO if more then one style update, call setStyles will be better performance
          for (var key in styles) {
            var val = styles[key];
            val = (0, _styleUnit.convertUnit)(val, key);
            node.setStyle(key, val);
          }
        },
        beforeRender: function beforeRender() {
          // Turn off batched updates
          document.open();

          // Init rem unit
          (0, _styleUnit.setRem)(this.getDeviceWidth() / this.getViewportWidth());
        },
        afterRender: function afterRender() {
          if (document.listener && document.listener.createFinish) {
            document.listener.createFinish();
          }

          // Turn on batched updates
          document.close();
        },
        setNativeProps: function setNativeProps(node, props, skipSetStyles) {
          for (var prop in props) {
            var value = props[prop];
            if (prop === CHILDREN) {
              continue;
            }

            if (value != null) {
              if (prop === STYLE) {
                if (skipSetStyles) {
                  continue;
                }
                this.setStyles(node, value);
              } else if (EVENT_PREFIX_REGEXP.test(prop)) {
                var eventName = prop.slice(2).toLowerCase();
                this.addEventListener(node, eventName, value, props);
              } else {
                this.setAttribute(node, prop, value);
              }
            }
          }
        }
      };

      exports.default = Driver;
      module.exports = exports.default;

      /***/
    },
    /* 38 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _native = __webpack_require__(12);

      var _native2 = _interopRequireDefault(_native);

      var _instance = __webpack_require__(1);

      var _instance2 = _interopRequireDefault(_instance);

      var _instantiateComponent = __webpack_require__(3);

      var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);

      var _getElementKeyName = __webpack_require__(10);

      var _getElementKeyName2 = _interopRequireDefault(_getElementKeyName);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        } return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }

      /**
         * Fragment Component
         */
      var FragmentComponent = function(_NativeComponent) {
        _inherits(FragmentComponent, _NativeComponent);

        function FragmentComponent(element) {
          _classCallCheck(this, FragmentComponent);

          return _possibleConstructorReturn(this, (FragmentComponent.__proto__ || Object.getPrototypeOf(FragmentComponent)).call(this, element));
        }

        _createClass(FragmentComponent, [{
          key: 'mountComponent',
          value: function mountComponent(parent, parentInstance, context, childMounter) {
            // Parent native element
            this._parent = parent;
            this._parentInstance = parentInstance;
            this._context = context;
            this._mountID = _host2.default.mountID++;

            var instance = {
              _internal: this
            };
            this._instance = instance;

            var fragment = this.getNativeNode();
            var children = this._currentElement;

            // Process children
            this.mountChildren(children, context);

            if (childMounter) {
              childMounter(fragment, parent);
            } else {
              var isFragmentParent = Array.isArray(parent);
              for (var i = 0; i < fragment.length; i++) {
                var child = fragment[i];
                // When the parent is also a fragment
                if (isFragmentParent) {
                  parent.push(child);
                } else {
                  _host2.default.driver.appendChild(child, parent);
                }
              }
            }

            return instance;
          }
        }, {
          key: 'mountChildren',
          value: function mountChildren(children, context) {
            var _this2 = this;

            var renderedChildren = this._renderedChildren = {};
            var fragment = this.getNativeNode();

            var renderedChildrenImage = children.map(function(element, index) {
              var renderedChild = (0, _instantiateComponent2.default)(element);
              var name = (0, _getElementKeyName2.default)(renderedChildren, element, index);
              renderedChildren[name] = renderedChild;
              renderedChild._mountIndex = index;
              // Mount
              var mountImage = renderedChild.mountComponent(_this2._parent, _this2._instance, context, function(nativeNode) {
                if (Array.isArray(nativeNode)) {
                  for (var i = 0; i < nativeNode.length; i++) {
                    fragment.push(nativeNode[i]);
                  }
                } else {
                  fragment.push(nativeNode);
                }
              });
              return mountImage;
            });

            return renderedChildrenImage;
          }
        }, {
          key: 'unmountComponent',
          value: function unmountComponent(notRemoveChild) {
            if (this._nativeNode) {
              _instance2.default.remove(this._nativeNode);
              if (!notRemoveChild) {
                for (var i = 0; i < this._nativeNode.length; i++) {
                  _host2.default.driver.removeChild(this._nativeNode[i]);
                }
              }
            }

            // Do not need remove child when their parent is removed
            this.unmountChildren(true);

            this._currentElement = null;
            this._nativeNode = null;
            this._parent = null;
            this._parentInstance = null;
            this._context = null;
            this._instance = null;
          }
        }, {
          key: 'updateComponent',
          value: function updateComponent(prevElement, nextElement, prevContext, nextContext) {
            // Replace current element
            this._currentElement = nextElement;
            this.updateChildren(this._currentElement, nextContext);
          }
        }, {
          key: 'getNativeNode',
          value: function getNativeNode() {
            if (this._nativeNode == null) {
              this._nativeNode = [];
            }

            return this._nativeNode;
          }
        }, {
          key: 'getPublicInstance',
          value: function getPublicInstance() {
            return this.getNativeNode();
          }
        }, {
          key: 'getName',
          value: function getName() {
            return 'fragment';
          }
        }]);

        return FragmentComponent;
      }(_native2.default);

      exports.default = FragmentComponent;
      module.exports = exports.default;

      /***/
    },
    /* 39 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

      var hasOwnProperty = Object.prototype.hasOwnProperty;

      /**
         * inlined Object.is polyfill to avoid requiring consumers ship their own
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
         */
      function is(x, y) {
        // SameValue algorithm
        if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return x !== 0 || 1 / x === 1 / y;
        } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
        }
      }

      /**
         * Performs equality by iterating through keys on an object and returning false
         * when any key has values which are not strictly equal between the arguments.
         * Returns true when the values of all keys are strictly equal.
         */
      function shallowEqual(objA, objB) {
        if (is(objA, objB)) {
          return true;
        }

        if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
          return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
          return false;
        }

        // Test for A's keys different from B.
        for (var i = 0; i < keysA.length; i++) {
          if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
          }
        }

        return true;
      }

      exports.default = shallowEqual;
      module.exports = exports.default;

      /***/
    },
    /* 40 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      function enqueueCallback(internal, callback) {
        if (callback) {
          var callbackQueue = internal._pendingCallbacks || (internal._pendingCallbacks = []);
          callbackQueue.push(callback);
        }
      }

      function enqueueState(internal, partialState) {
        if (partialState) {
          var stateQueue = internal._pendingStateQueue || (internal._pendingStateQueue = []);
          stateQueue.push(partialState);
        }
      }

      var Updater = {
        setState: function setState(component, partialState, callback) {
          var internal = component._internal;

          if (!internal) {
            return;
          }

          enqueueState(internal, partialState);
          enqueueCallback(internal, callback);

          // pending in componentWillReceiveProps and componentWillMount
          if (!internal._pendingState && internal._renderedComponent) {
            this.runUpdate(component);
          }
        },

        forceUpdate: function forceUpdate(component, callback) {
          var internal = component._internal;

          if (!internal) {
            return;
          }

          internal._pendingForceUpdate = true;

          enqueueCallback(internal, callback);
          // pending in componentWillMount
          if (internal._renderedComponent) {
            this.runUpdate(component);
          }
        },

        runUpdate: function runUpdate(component) {
          var internal = component._internal;

          // If updateComponent happens to enqueue any new updates, we
          // shouldn't execute the callbacks until the next render happens, so
          // stash the callbacks first
          var callbacks = internal._pendingCallbacks;
          internal._pendingCallbacks = null;

          var prevElement = internal._currentElement;
          var prevUnmaskedContext = internal._context;

          if (internal._pendingStateQueue || internal._pendingForceUpdate) {
            internal.updateComponent(prevElement, prevElement, prevUnmaskedContext, prevUnmaskedContext);
          }

          this.runCallbacks(callbacks, component);
        },

        runCallbacks: function runCallbacks(callbacks, context) {
          if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
              callbacks[i].call(context);
            }
          }
        }
      };

      exports.default = Updater;
      module.exports = exports.default;

      /***/
    },
    /* 41 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      /**
         * Stateless Component Class Wrapper
         */
      var StatelessComponent = function() {
        function StatelessComponent(pureRender) {
          _classCallCheck(this, StatelessComponent);

          // A stateless function
          this.pureRender = pureRender;
        }

        _createClass(StatelessComponent, [{
          key: 'render',
          value: function render() {
            if (false) { }

            return this.pureRender(this.props, this.context);
          }
        }]);

        return StatelessComponent;
      }();

      exports.default = StatelessComponent;
      module.exports = exports.default;

      /***/
    },
    /* 42 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _stateless = __webpack_require__(41);

      var _stateless2 = _interopRequireDefault(_stateless);

      var _updater = __webpack_require__(40);

      var _updater2 = _interopRequireDefault(_updater);

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _ref = __webpack_require__(11);

      var _ref2 = _interopRequireDefault(_ref);

      var _instantiateComponent = __webpack_require__(3);

      var _instantiateComponent2 = _interopRequireDefault(_instantiateComponent);

      var _shouldUpdateComponent = __webpack_require__(5);

      var _shouldUpdateComponent2 = _interopRequireDefault(_shouldUpdateComponent);

      var _shallowEqual = __webpack_require__(39);

      var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function performInSandbox(fn, instance, callback) {
        try {
          return fn();
        } catch (e) {
          if (callback) {
            callback(e);
          } else {
            handleError(instance, e);
          }
        }
      }

      function handleError(instance, error) {
        var boundary = void 0;

        while (instance) {
          if (typeof instance.componentDidCatch === 'function') {
            boundary = instance;
            break;
          } else if (instance._internal && instance._internal._parentInstance) {
            instance = instance._internal._parentInstance;
          } else {
            break;
          }
        }

        if (boundary) {
          boundary.componentDidCatch(error);
        } else {
          if (_host2.default.sandbox) {
            setTimeout(function() {
              throw error;
            }, 0);
          } else {
            throw error;
          }
        }
      }

      var measureLifeCycle = void 0;
      if (false) { }

      /**
         * Composite Component
         */

      var CompositeComponent = function() {
        function CompositeComponent(element) {
          _classCallCheck(this, CompositeComponent);

          this._currentElement = element;
        }

        _createClass(CompositeComponent, [{
          key: 'getName',
          value: function getName() {
            var type = this._currentElement.type;
            var constructor = this._instance && this._instance.constructor;
            return type.displayName || constructor && constructor.displayName || type.name || constructor && constructor.name || null;
          }
        }, {
          key: 'mountComponent',
          value: function mountComponent(parent, parentInstance, context, childMounter) {
            var _this = this;

            this._parent = parent;
            this._parentInstance = parentInstance;
            this._context = context;
            this._mountID = _host2.default.mountID++;
            this._updateCount = 0;

            if (false) { }

            var Component = this._currentElement.type;
            var publicProps = this._currentElement.props;
            var isClass = Component.prototype;
            var isComponentClass = isClass && Component.prototype.isComponentClass;
            // Class stateless component without state but have lifecycles
            var isStatelessClass = isClass && Component.prototype.render;

            // Context process
            var publicContext = this._processContext(context);

            // Initialize the public class
            var instance = void 0;
            var renderedElement = void 0;

            if (isComponentClass || isStatelessClass) {
              // Component instance
              instance = new Component(publicProps, publicContext, _updater2.default);
            } else if (typeof Component === 'function') {
              // Functional stateless component without state and lifecycles
              instance = new _stateless2.default(Component);
            } else {
              throw new Error('Invalid component type: ' + Component + '. (keys: ' + Object.keys(Component) + ')');
            }

            // These should be set up in the constructor, but as a convenience for
            // simpler class abstractions, we set them up after the fact.
            instance.props = publicProps;
            instance.context = publicContext;
            instance.refs = {};

            // Inject the updater into instance
            instance.updater = _updater2.default;
            instance._internal = this;
            this._instance = instance;

            // Init state, must be set to an object or null
            var initialState = instance.state;
            if (initialState === undefined) {
              // TODO clone the state?
              instance.state = initialState = null;
            }

            var error = null;
            var errorCallback = function errorCallback(e) {
              error = e;
            };

            if (instance.componentWillMount) {
              performInSandbox(function() {
                if (false) { } else {
                  instance.componentWillMount();
                }
              }, instance, errorCallback);
            }

            if (renderedElement == null) {
              _host2.default.component = this;
              // Process pending state when call setState in componentWillMount
              instance.state = this._processPendingState(publicProps, publicContext);

              performInSandbox(function() {
                if (false) { } else {
                  renderedElement = instance.render();
                }
              }, instance, errorCallback);

              _host2.default.component = null;
            }

            this._renderedComponent = (0, _instantiateComponent2.default)(renderedElement);
            this._renderedComponent.mountComponent(this._parent, instance, this._processChildContext(context), childMounter);

            if (error) {
              handleError(instance, error);
            }

            if (this._currentElement && this._currentElement.ref) {
              _ref2.default.attach(this._currentElement._owner, this._currentElement.ref, this);
            }

            if (instance.componentDidMount) {
              performInSandbox(function() {
                if (false) { } else {
                  instance.componentDidMount();
                }
              }, instance);
            }

            _host2.default.hook.Reconciler.mountComponent(this);

            if (false) { }

            return instance;
          }
        }, {
          key: 'unmountComponent',
          value: function unmountComponent(notRemoveChild) {
            var instance = this._instance;

            if (instance.componentWillUnmount) {
              performInSandbox(function() {
                instance.componentWillUnmount();
              }, instance);
            }

            _host2.default.hook.Reconciler.unmountComponent(this);

            instance._internal = null;

            if (this._renderedComponent != null) {
              var ref = this._currentElement.ref;
              if (ref) {
                _ref2.default.detach(this._currentElement._owner, ref, this);
              }

              this._renderedComponent.unmountComponent(notRemoveChild);
              this._renderedComponent = null;
              this._instance = null;
            }

            this._currentElement = null;
            this._parentInstance = null;

            // Reset pending fields
            // Even if this component is scheduled for another update in ReactUpdates,
            // it would still be ignored because these fields are reset.
            this._pendingStateQueue = null;
            this._pendingForceUpdate = false;

            // These fields do not really need to be reset since this object is no
            // longer accessible.
            this._context = null;
          }

          /**
             * Filters the context object to only contain keys specified in
             * `contextTypes`
             */

        }, {
          key: '_processContext',
          value: function _processContext(context) {
            var Component = this._currentElement.type;
            var contextTypes = Component.contextTypes;
            if (!contextTypes) {
              return {};
            }
            var maskedContext = {};
            for (var contextName in contextTypes) {
              maskedContext[contextName] = context[contextName];
            }
            return maskedContext;
          }
        }, {
          key: '_processChildContext',
          value: function _processChildContext(currentContext) {
            var instance = this._instance;
            var childContext = instance.getChildContext && instance.getChildContext();
            if (childContext) {
              return Object.assign({}, currentContext, childContext);
            }
            return currentContext;
          }
        }, {
          key: '_processPendingState',
          value: function _processPendingState(props, context) {
            var instance = this._instance;
            var queue = this._pendingStateQueue;
            if (!queue) {
              return instance.state;
            }
            // Reset pending queue
            this._pendingStateQueue = null;
            var nextState = Object.assign({}, instance.state);
            for (var i = 0; i < queue.length; i++) {
              var partial = queue[i];
              Object.assign(nextState, typeof partial === 'function' ? partial.call(instance, nextState, props, context) : partial);
            }

            return nextState;
          }
        }, {
          key: 'updateComponent',
          value: function updateComponent(prevElement, nextElement, prevUnmaskedContext, nextUnmaskedContext) {
            var instance = this._instance;

            if (false) { }

            if (!instance) {
              console.error('Update component \'' + this.getName() + '\' that has already been unmounted (or failed to mount).');
            }

            var willReceive = false;
            var nextContext = void 0;
            var nextProps = void 0;

            // Determine if the context has changed or not
            if (this._context === nextUnmaskedContext) {
              nextContext = instance.context;
            } else {
              nextContext = this._processContext(nextUnmaskedContext);
              willReceive = true;
            }

            // Distinguish between a props update versus a simple state update
            if (prevElement === nextElement) {
              // Skip checking prop types again -- we don't read component.props to avoid
              // warning for DOM component props in this upgrade
              nextProps = nextElement.props;
            } else {
              nextProps = nextElement.props;
              willReceive = true;
            }

            var hasReceived = willReceive && instance.componentWillReceiveProps;

            if (hasReceived) {
              // Calling this.setState() within componentWillReceiveProps will not trigger an additional render.
              this._pendingState = true;
              performInSandbox(function() {
                instance.componentWillReceiveProps(nextProps, nextContext);
              }, instance);
              this._pendingState = false;
            }

            // Update refs
            _ref2.default.update(prevElement, nextElement, this);

            // Shoud update always default
            var shouldUpdate = true;
            var prevProps = instance.props;
            var prevState = instance.state;
            // TODO: could delay execution processPendingState
            var nextState = this._processPendingState(nextProps, nextContext);

            // ShouldComponentUpdate is not called when forceUpdate is used
            if (!this._pendingForceUpdate) {
              if (instance.shouldComponentUpdate) {
                shouldUpdate = performInSandbox(function() {
                  return instance.shouldComponentUpdate(nextProps, nextState, nextContext);
                }, instance);
              } else if (instance.isPureComponentClass) {
                shouldUpdate = !(0, _shallowEqual2.default)(prevProps, nextProps) || !(0, _shallowEqual2.default)(prevState, nextState);
              }
            }

            if (shouldUpdate) {
              this._pendingForceUpdate = false;
              // Will set `this.props`, `this.state` and `this.context`.
              var prevContext = instance.context;

              // Cannot use this.setState() in componentWillUpdate.
              // If need to update state in response to a prop change, use componentWillReceiveProps instead.
              performInSandbox(function() {
                if (instance.componentWillUpdate) {
                  instance.componentWillUpdate(nextProps, nextState, nextContext);
                }
              }, instance);

              // Replace with next
              this._currentElement = nextElement;
              this._context = nextUnmaskedContext;
              instance.props = nextProps;
              instance.state = nextState;
              instance.context = nextContext;

              this._updateRenderedComponent(nextUnmaskedContext);

              performInSandbox(function() {
                if (instance.componentDidUpdate) {
                  instance.componentDidUpdate(prevProps, prevState, prevContext);
                }
              }, instance);

              this._updateCount++;
            } else {
              // If it's determined that a component should not update, we still want
              // to set props and state but we shortcut the rest of the update.
              this._currentElement = nextElement;
              this._context = nextUnmaskedContext;
              instance.props = nextProps;
              instance.state = nextState;
              instance.context = nextContext;
            }

            // Flush setState callbacks set in componentWillReceiveProps
            if (hasReceived) {
              var callbacks = this._pendingCallbacks;
              this._pendingCallbacks = null;
              _updater2.default.runCallbacks(callbacks, instance);
            }

            if (false) { }

            _host2.default.hook.Reconciler.receiveComponent(this);
          }

          /**
             * Call the component's `render` method and update the DOM accordingly.
             */

        }, {
          key: '_updateRenderedComponent',
          value: function _updateRenderedComponent(context) {
            var _this2 = this;

            var prevRenderedComponent = this._renderedComponent;
            var prevRenderedElement = prevRenderedComponent._currentElement;

            var instance = this._instance;
            var nextRenderedElement = void 0;

            _host2.default.component = this;

            performInSandbox(function() {
              if (false) { } else {
                nextRenderedElement = instance.render();
              }
            }, instance);

            _host2.default.component = null;

            if ((0, _shouldUpdateComponent2.default)(prevRenderedElement, nextRenderedElement)) {
              prevRenderedComponent.updateComponent(prevRenderedElement, nextRenderedElement, prevRenderedComponent._context, this._processChildContext(context));
              if (false) { }
            } else {
              var oldChild = prevRenderedComponent.getNativeNode();
              prevRenderedComponent.unmountComponent(true);

              this._renderedComponent = (0, _instantiateComponent2.default)(nextRenderedElement);
              this._renderedComponent.mountComponent(this._parent, instance, this._processChildContext(context), function(newChild, parent) {
                // TODO: Duplicate code in native component file
                if (!Array.isArray(newChild)) {
                  newChild = [newChild];
                }

                // oldChild or newChild all maybe fragment
                if (!Array.isArray(oldChild)) {
                  oldChild = [oldChild];
                }

                // If newChild count large then oldChild
                var lastNewChild = void 0;
                for (var i = 0; i < newChild.length; i++) {
                  var child = newChild[i];
                  if (oldChild[i]) {
                    _host2.default.driver.replaceChild(child, oldChild[i]);
                  } else {
                    _host2.default.driver.insertAfter(child, lastNewChild);
                  }
                  lastNewChild = child;
                }

                // If newChild count less then oldChild
                if (newChild.length < oldChild.length) {
                  for (var _i = newChild.length; _i < oldChild.length; _i++) {
                    _host2.default.driver.removeChild(oldChild[_i]);
                  }
                }
              });
            }
          }
        }, {
          key: 'getNativeNode',
          value: function getNativeNode() {
            var renderedComponent = this._renderedComponent;
            if (renderedComponent) {
              return renderedComponent.getNativeNode();
            }
          }
        }, {
          key: 'getPublicInstance',
          value: function getPublicInstance() {
            var instance = this._instance;
            // The Stateless components cannot be given refs
            if (instance instanceof _stateless2.default) {
              return null;
            }
            return instance;
          }
        }]);

        return CompositeComponent;
      }();

      exports.default = CompositeComponent;
      module.exports = exports.default;

      /***/
    },
    /* 43 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      /**
         * Text Component
         */
      var TextComponent = function() {
        function TextComponent(element) {
          _classCallCheck(this, TextComponent);

          this._currentElement = element;
          this._stringText = String(element);
        }

        _createClass(TextComponent, [{
          key: 'mountComponent',
          value: function mountComponent(parent, parentInstance, context, childMounter) {
            this._parent = parent;
            this._parentInstance = parentInstance;
            this._context = context;
            this._mountID = _host2.default.mountID++;

            // Weex dom operation
            var nativeNode = this.getNativeNode();

            if (childMounter) {
              childMounter(nativeNode, parent);
            } else {
              _host2.default.driver.appendChild(nativeNode, parent);
            }

            var instance = {
              _internal: this
            };

            _host2.default.hook.Reconciler.mountComponent(this);

            return instance;
          }
        }, {
          key: 'unmountComponent',
          value: function unmountComponent(notRemoveChild) {
            if (this._nativeNode && !notRemoveChild) {
              _host2.default.driver.removeChild(this._nativeNode, this._parent);
            }

            _host2.default.hook.Reconciler.unmountComponent(this);

            this._currentElement = null;
            this._nativeNode = null;
            this._parent = null;
            this._parentInstance = null;
            this._context = null;
            this._stringText = null;
          }
        }, {
          key: 'updateComponent',
          value: function updateComponent(prevElement, nextElement, context) {
            // If some text do noting
            if (prevElement !== nextElement) {
              // Replace current element
              this._currentElement = nextElement;
              // Devtool read the latest stringText value
              this._stringText = String(nextElement);
              _host2.default.driver.updateText(this.getNativeNode(), this._stringText);
              _host2.default.hook.Reconciler.receiveComponent(this);
            }
          }
        }, {
          key: 'getNativeNode',
          value: function getNativeNode() {
            if (this._nativeNode == null) {
              this._nativeNode = _host2.default.driver.createText(this._stringText);
            }
            return this._nativeNode;
          }
        }]);

        return TextComponent;
      }();

      exports.default = TextComponent;
      module.exports = exports.default;

      /***/
    },
    /* 44 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      /**
         * Empty Component
         */
      var EmptyComponent = function() {
        function EmptyComponent() {
          _classCallCheck(this, EmptyComponent);

          this._currentElement = null;
        }

        _createClass(EmptyComponent, [{
          key: 'mountComponent',
          value: function mountComponent(parent, parentInstance, context, childMounter) {
            this._parent = parent;
            this._parentInstance = parentInstance;
            this._context = context;

            var instance = {
              _internal: this
            };

            var nativeNode = this.getNativeNode();
            if (childMounter) {
              childMounter(nativeNode, parent);
            } else {
              _host2.default.driver.appendChild(nativeNode, parent);
            }

            return instance;
          }
        }, {
          key: 'unmountComponent',
          value: function unmountComponent(notRemoveChild) {
            if (this._nativeNode && !notRemoveChild) {
              _host2.default.driver.removeChild(this._nativeNode, this._parent);
            }

            this._nativeNode = null;
            this._parent = null;
            this._parentInstance = null;
            this._context = null;
          }
        }, {
          key: 'updateComponent',
          value: function updateComponent() {
            // Noop
          }
        }, {
          key: 'getNativeNode',
          value: function getNativeNode() {
            // Weex native node
            if (this._nativeNode == null) {
              this._nativeNode = _host2.default.driver.createEmpty();
            }

            return this._nativeNode;
          }
        }]);

        return EmptyComponent;
      }();

      exports.default = EmptyComponent;
      module.exports = exports.default;

      /***/
    },
    /* 45 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = inject;

      var _universalEnv = __webpack_require__(14);

      var _host = __webpack_require__(0);

      var _host2 = _interopRequireDefault(_host);

      var _empty = __webpack_require__(44);

      var _empty2 = _interopRequireDefault(_empty);

      var _native = __webpack_require__(12);

      var _native2 = _interopRequireDefault(_native);

      var _text = __webpack_require__(43);

      var _text2 = _interopRequireDefault(_text);

      var _composite = __webpack_require__(42);

      var _composite2 = _interopRequireDefault(_composite);

      var _fragment = __webpack_require__(38);

      var _fragment2 = _interopRequireDefault(_fragment);

      var _driverWeex = __webpack_require__(37);

      var _driverWeex2 = _interopRequireDefault(_driverWeex);

      var _driverBrowser = __webpack_require__(26);

      var _driverBrowser2 = _interopRequireDefault(_driverBrowser);

      var _hook = __webpack_require__(16);

      var _hook2 = _interopRequireDefault(_hook);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function inject(_ref) {
        var driver = _ref.driver,
          hook = _ref.hook,
          measurer = _ref.measurer,
          deviceWidth = _ref.deviceWidth,
          viewportWidth = _ref.viewportWidth,
          eventRegistry = _ref.eventRegistry,
          bodyType = _ref.bodyType,
          bodyProps = _ref.bodyProps;

          // Inject component class
        _host2.default.EmptyComponent = _empty2.default;
        _host2.default.NativeComponent = _native2.default;
        _host2.default.TextComponent = _text2.default;
        _host2.default.FragmentComponent = _fragment2.default;
        _host2.default.CompositeComponent = _composite2.default;

        // Inject devtool hook
        _host2.default.hook = hook || _hook2.default;

        // Inject performance measurer
        _host2.default.measurer = measurer;

        // Inject render driver
        if (!_host2.default.driver) {
          if (!driver) {
            if (_universalEnv.isWeex) {
              driver = _driverWeex2.default;
            } else if (_universalEnv.isWeb) {
              driver = _driverBrowser2.default;
            } else {
              throw Error('No builtin driver matched');
            }
          }
          _host2.default.driver = driver;
        }

        if (deviceWidth && _host2.default.driver.setDeviceWidth) {
          _host2.default.driver.setDeviceWidth(deviceWidth);
        }

        if (viewportWidth && _host2.default.driver.setViewportWidth) {
          _host2.default.driver.setViewportWidth(viewportWidth);
        }

        if (eventRegistry) {
          _host2.default.driver.eventRegistry = eventRegistry;
        }

        // Body custom type only works in weex
        if (bodyType) {
          _host2.default.driver.bodyType = bodyType;
        }

        if (bodyProps) {
          _host2.default.driver.bodyProps = bodyProps;
        }
      }
      module.exports = exports.default;

      /***/
    },
    /* 46 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _component = __webpack_require__(2);

      var _component2 = _interopRequireDefault(_component);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        } return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }

      /**
         * Pure component class.
         */
      var PureComponent = function(_Component) {
        _inherits(PureComponent, _Component);

        function PureComponent(props, context) {
          _classCallCheck(this, PureComponent);

          return _possibleConstructorReturn(this, (PureComponent.__proto__ || Object.getPrototypeOf(PureComponent)).call(this, props, context));
        }

        _createClass(PureComponent, [{
          key: 'isPureComponentClass',
          value: function isPureComponentClass() { }
        }]);

        return PureComponent;
      }(_component2.default);

      exports.default = PureComponent;
      module.exports = exports.default;

      /***/
    },
    /* 47 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });

      var _createClass = function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
          }
        } return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
        };
      }();

      var _component = __webpack_require__(2);

      var _component2 = _interopRequireDefault(_component);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        } return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }

      var rootCounter = 1;

      var Root = function(_Component) {
        _inherits(Root, _Component);

        function Root() {
          var _ref;

          var _temp, _this, _ret;

          _classCallCheck(this, Root);

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Root.__proto__ || Object.getPrototypeOf(Root)).call.apply(_ref, [this].concat(args))), _this), _this.rootID = rootCounter++, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Root, [{
          key: 'isRootComponent',
          value: function isRootComponent() { }
        }, {
          key: 'render',
          value: function render() {
            return this.props.children;
          }
        }, {
          key: 'getPublicInstance',
          value: function getPublicInstance() {
            return this.getRenderedComponent().getPublicInstance();
          }
        }, {
          key: 'getRenderedComponent',
          value: function getRenderedComponent() {
            return this._internal._renderedComponent;
          }
        }]);

        return Root;
      }(_component2.default);

      exports.default = Root;
      module.exports = exports.default;

      /***/
    },
    /* 48 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      var _hook = __webpack_require__(16);

      var _hook2 = _interopRequireDefault(_hook);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.inject(_hook2.default);
      }

      /***/
    },
    /* 49 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';


      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.createContext = exports.Children = exports.version = exports.setNativeProps = exports.findComponentInstance = exports.unmountComponentAtNode = exports.findDOMNode = exports.createPortal = exports.hydrate = exports.render = exports.PropTypes = exports.PureComponent = exports.Component = exports.createFactory = exports.isValidElement = exports.cloneElement = exports.createElement = undefined;

      __webpack_require__(48);

      var _element = __webpack_require__(7);

      var _component = __webpack_require__(2);

      var _component2 = _interopRequireDefault(_component);

      var _purecomponent = __webpack_require__(46);

      var _purecomponent2 = _interopRequireDefault(_purecomponent);

      var _proptypes = __webpack_require__(13);

      var _proptypes2 = _interopRequireDefault(_proptypes);

      var _render2 = __webpack_require__(4);

      var _render3 = _interopRequireDefault(_render2);

      var _hydrate2 = __webpack_require__(23);

      var _hydrate3 = _interopRequireDefault(_hydrate2);

      var _createPortal2 = __webpack_require__(22);

      var _createPortal3 = _interopRequireDefault(_createPortal2);

      var _findDOMNode2 = __webpack_require__(8);

      var _findDOMNode3 = _interopRequireDefault(_findDOMNode2);

      var _unmountComponentAtNode2 = __webpack_require__(6);

      var _unmountComponentAtNode3 = _interopRequireDefault(_unmountComponentAtNode2);

      var _findComponentInstance2 = __webpack_require__(21);

      var _findComponentInstance3 = _interopRequireDefault(_findComponentInstance2);

      var _setNativeProps2 = __webpack_require__(20);

      var _setNativeProps3 = _interopRequireDefault(_setNativeProps2);

      var _version2 = __webpack_require__(19);

      var _version3 = _interopRequireDefault(_version2);

      var _children = __webpack_require__(18);

      var _children2 = _interopRequireDefault(_children);

      var _createContext2 = __webpack_require__(17);

      var _createContext3 = _interopRequireDefault(_createContext2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      exports.createElement = _element.createElement;
      exports.cloneElement = _element.cloneElement;
      exports.isValidElement = _element.isValidElement;
      exports.createFactory = _element.createFactory;
      exports.Component = _component2.default;
      exports.PureComponent = _purecomponent2.default;
      exports.PropTypes = _proptypes2.default;
      exports.render = _render3.default;
      exports.hydrate = _hydrate3.default;
      exports.createPortal = _createPortal3.default;
      exports.findDOMNode = _findDOMNode3.default;
      exports.unmountComponentAtNode = _unmountComponentAtNode3.default;
      exports.findComponentInstance = _findComponentInstance3.default;
      exports.setNativeProps = _setNativeProps3.default;
      exports.version = _version3.default;
      exports.Children = _children2.default;
      exports.createContext = _createContext3.default;

      /***/
    }
  /******/]);
}; ;

function getRax() {
  var module = {};
  raxFactory(null, {}, module);
  return module.exports;
}
