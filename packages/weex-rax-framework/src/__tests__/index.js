'use strict';

require('weex-runtime-js').freezePrototype();

import WeexRuntime from '../mock/weex-rax-js-runtime';
import * as framework from '../index';

WeexRuntime.config.frameworks = { Rax: framework };
const context = WeexRuntime.init(WeexRuntime.config);
const { Document, Element, Comment } = WeexRuntime.config;

global.callNative = () => { };
global.WXEnvironment = {
  'scale': 2,
  'appVersion': '1.8.3',
  'deviceModel': 'iPhone7,2',
  'appName': 'WeexDemo',
  'platform': 'iOS',
  'osVersion': '9.3',
  'weexVersion': '0.7.0',
  'deviceHeight': 1334,
  'deviceWidth': 750,
  'logLevel': 'log',
  ttid: '123456',
  utdid: 'VXViP5AJ2Q0zCzWp0L',
};

describe('framework', () => {
  let instance;
  let runtime;
  let __weex_options__ = {
    bundleUrl: 'http://example.com',
    debug: true
  };
  let __weex_callbacks__;
  let __weex_data__;
  let sendTasksHandler = () => { };
  let sendTasks = function() {
    return sendTasksHandler.apply(null, arguments);
  };

  beforeEach(() => {
    Document.handler = sendTasks;
    framework.init({ Document, Element, Comment });
  });

  afterEach(() => {
    delete Document.handler;
    instance = null;
  });

  it('render a text', () => {
    const code = `
        define("rax-test", function(require) {
            'use strict';
        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
        var _rax = require('rax');
        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
        function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
        function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx createElement */
        var App = function (_Component) {
          _inherits(App, _Component);
          function App() {
            _classCallCheck(this, App);
            return _possibleConstructorReturn(this, Object.getPrototypeOf(App).apply(this, arguments));
          }
          _createClass(App, [{
            key: 'render',
            value: function render() {
              return (0, _rax.createElement)(
                'text',
                null,
                'Hello'
              );
            }
          }]);
          return App;
        }(_rax.Component);
        (0, _rax.render)((0, _rax.createElement)(App, null));
        });
        require("rax-test");
      `;

    const instance = context.createInstance(1, `// { "framework": "Rax" }\n${code}`, {}) || {};
    expect(context.getRoot(1)).toEqual({
      type: 'div',
      ref: '_root',
      children: [{ type: 'text', ref: '8', attr: { value: 'Hello' } }]
    });
  });
});
