'use strict';

// require('weex-runtime-js').freezePrototype();

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

          var Rax = require('rax');
          function App() {
            return Rax.createElement('text', null, 'Hello');
          }
          Rax.render(Rax.createElement(App, null));
        });

        require("rax-test");
      `;

    const instance = context.createInstance(1, `// { "framework": "Rax" }\n${code}`, __weex_options__) || {};
    expect(context.getRoot(1)).toEqual({
      type: 'div',
      ref: '_root',
      children: [{ type: 'text', ref: '8', attr: { value: 'Hello' } }]
    });
  });
});
