'use strict';

require('weex-runtime-js').freezePrototype();

import { Runtime, Instance } from 'weex-vdom-tester';
import { config, init } from 'weex-runtime-js';
import * as framework from '../index';

init();

const { Document, Element, Comment } = config;

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
  let sendTasks = function () {
    return sendTasksHandler.apply(null, arguments);
  };

  beforeEach(() => {
    // Create a Weex JavaScript runtime for a certain Weex JS framework.
    // You can also simulate the native environment which includes
    // global env variables, native modules & components.
    Document.handler = sendTasks;
    framework.init({ Document, Element, Comment });
    runtime = new Runtime(framework);
    framework.registerModules({
      webSocket: ['addEventListener', 'removeAllEventListeners', 'onopen', 'onerror', 'send', 'onmessage', 'close', 'onclose', 'WebSocket'],
      geolocation: ['addEventListener', 'removeAllEventListeners', 'getCurrentPosition', 'watchPosition', 'clearWatch'],
      audio: ['addEventListener', 'removeAllEventListeners', 'canPlayType', 'stop', 'pause', 'load', 'play', 'setVolume'],
      picker: ['addEventListener', 'removeAllEventListeners', 'pickTime', 'pickDate', 'pick'],
    });

    framework.registerComponents(['div', 'video']);
    sendTasksHandler = function () {
      runtime.target.callNative(...arguments);
      // FIXME: Hack for should return value like setTimeout
      return '1';
    };
    // Create a Weex instance in a certain runtime.
    instance = new Instance(runtime);
  });

  afterEach(() => {
    delete Document.handler;
    instance.$destroy();
    instance = null;
  });

  it('weex only var', () => {
    const code = `
      alert(__weex_options__.debug)
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: __weex_options__.debug
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('render a text', () => {
    const code = `
      var Rax = require('rax');
      var createElement = Rax.createElement;
      var render = Rax.render;

      function Hello(){
        return createElement('text', {value: 'Hello'});
      }

      render(createElement(Hello));
    `;

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(instance.getRealRoot()).toEqual({
      type: 'div',
      children: [{ type: 'text', attr: { value: 'Hello' } }]
    });
  });

  it('alert message', () => {
    const code = `
      alert('Hello');
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'Hello'
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('window is window.window', () => {
    const code = `
      alert(window === window.window);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: true
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('self is window', () => {
    const code = `
      alert(window === self);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: true
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('this is window', () => {
    const code = `
      alert(this === window);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: true
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('window is global context', () => {
    const code = `
      this.foo = 'foo';
      alert(foo);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'foo'
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('run in strict mode', () => {
    const code = `
      a = 'throws ReferenceError';
    `;

    expect(function () {
      instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    }).toThrowError(/a is not defined/);
  });

  it('run in Object.prototype freeze mode', () => {
    const code = `
      function Foo(){}
      // Throw Error
      Foo.prototype.toString = function(){};
      // Could use Foo.prototype = {toString(){}}
    `;

    expect(function () {
      instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    }).toThrowError(/Cannot assign to read only property/);
  });

  it('run in Object freeze mode', () => {
    const code = `
      // Throw Error
      Object.assgin = function(){}
    `;

    expect(function () {
      instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    }).toThrowError(/object is not extensible/);
  });

  it('run in Object freeze mode', () => {
    const code = `
      var foo = new Object();
      // Throw Error
      foo.toString = function(){};
    `;

    expect(function () {
      instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    }).toThrowError(/Cannot assign to read only property/);
  });

  it('define a module', () => {
    const code = `
      define('alert-hello', function(){
        alert('Hello');
      });
      require('alert-hello');
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'Hello'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('atob', () => {
    const code = `
      alert(atob('Zm9v'));
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'foo'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('btoa', () => {
    const code = `
      alert(btoa('foo'));
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'Zm9v'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('document', () => {
    const code = `
      alert(document.URL);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'http://example.com'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('navigator', () => {
    const code = `
      alert(navigator.platform);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'iOS'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('location', () => {
    const code = `
      alert(location.origin);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'http://example.com'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('screen', () => {
    const code = `
      alert(screen.width);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 750
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('WebSocket', () => {
    const code = `
    const ws = new WebSocket('ws://echo.websocket.org');
    ws.onopen = function(ev){
      alert('hi');
    };
    ws.addEventListener('message', function(ev){
      alert(ev.data);
    });
    ws.send('Rock it with HTML5 WebSocket');
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual('Rock it with HTML5 WebSocket');
    });

    const alertMockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'hi'
      });
    });

    let messageCallbackId;
    const messageMockFn = jest.fn((funcId) => {
      messageCallbackId = funcId;
    });

    let openCallbackId;
    const openMockFn = jest.fn((funcId) => {
      openCallbackId = funcId;
    });

    instance.oncall('modal', 'alert', alertMockFn);
    instance.oncall('webSocket', 'onmessage', messageMockFn);
    instance.oncall('webSocket', 'onopen', openMockFn);
    instance.oncall('webSocket', 'send', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    instance.$callback(openCallbackId);
    instance.$callback(messageCallbackId, {
      data: 'hi'
    });

    expect(mockFn).toHaveBeenCalled();
    expect(messageMockFn).toHaveBeenCalled();
    expect(openMockFn).toHaveBeenCalled();
    expect(alertMockFn).toHaveBeenCalled();
  });

  it('CustomEvent', () => {
    const code = `
      var ev = new CustomEvent('click', {
        detail: 'custom'
      });
      alert(ev.type);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'click'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('FontFace', () => {
    const code = `
      var bitterFontFace = new FontFace('Bitter', 'url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)');
      alert(bitterFontFace.family);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'Bitter'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('postMessage', () => {
    const code = `
      window.addEventListener('message', function(e){
        alert(JSON.stringify(e.data));
      });
      window.postMessage({foo: 'foo'}, '*');
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: JSON.stringify({ foo: 'foo' })
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    expect(mockFn).toHaveBeenCalled();
  });

  it('URL', () => {
    const code = `
    var a = new URL("/", "https://developer.mozilla.org"); // Creates a URL pointing to 'https://developer.mozilla.org/'
    var b = new URL("https://developer.mozilla.org");      // Creates a URL pointing to 'https://developer.mozilla.org/'
    var c = new URL('en-US/docs', b);                      // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var d = new URL('/en-US/docs', b);                     // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var f = new URL('/en-US/docs', d);                     // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var g = new URL('/en-US/docs', "https://developer.mozilla.org/fr-FR/toto");
                                                           // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var h = new URL('/en-US/docs', a);                     // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var i = new URL('/en-US/docs', '');                    // Raises a SYNTAX ERROR exception as '/en-US/docs' is not valid
    var j = new URL('/en-US/docs');                        // Raises a SYNTAX ERROR exception as 'about:blank/en-US/docs' is not valid
    var k = new URL('http://www.example.com', 'https://developers.mozilla.com');
                                                           // Creates a URL pointing to 'http://www.example.com/'
    var l = new URL('http://www.example.com', b);          // Creates a URL pointing to 'http://www.example.com/'

    alert(l.toString());
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'http://www.example.com/'
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    expect(mockFn).toHaveBeenCalled();
  });

  it('URL.searchParams', () => {
    const code = `
    var params = (new URL("https://developer.mozilla.org?hello=world")).searchParams;
    alert(params.get('hello'));
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'world'
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    expect(mockFn).toHaveBeenCalled();
  });

  it('URLSearchParams', () => {
    const code = `
    var paramsString = "q=URLUtils.searchParams&topic=api"
    var searchParams = new URLSearchParams(paramsString);
    searchParams.has("topic") === true; // true
    searchParams.get("topic") === "api"; // true
    searchParams.getAll("topic"); // ["api"]
    searchParams.get("foo") === null; // true
    searchParams.append("topic", "webdev");
    searchParams.toString(); // "q=URLUtils.searchParams&topic=api&topic=webdev"
    searchParams.set("topic", "More webdev");
    searchParams.toString(); // "q=URLUtils.searchParams&topic=More+webdev"
    searchParams.delete("topic");
    searchParams.toString(); // "q=URLUtils.searchParams"

    alert(searchParams.toString());
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'q=URLUtils.searchParams'
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    expect(mockFn).toHaveBeenCalled();
  });

  it('XMLHttpRequest data', () => {
    const code = `
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://example.com');
      xhr.send();
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual(
        {
          url: 'http://example.com',
          method: 'GET',
          type: 'text',
          headers: {}
        }
      );
    });

    instance.oncall('stream', 'fetch', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    expect(mockFn).toHaveBeenCalled();
  });

  it('fetch data', () => {
    const code = `
      fetch('http://example.com').then(function(response) {
        if (response.status != -1 && response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      }).then(function (data) {
        console.log('fetch response data', data);
      });
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual(
        {
          url: 'http://example.com',
          method: 'GET',
          type: 'text'
        }
      );
    });

    instance.oncall('stream', 'fetch', mockFn);
    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
    expect(mockFn).toHaveBeenCalled();
  });

  it('response default status is 200', () => {
    const code = `
      var res = new Response();
      alert(res.status);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 200
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('response default statusText is OK', () => {
    const code = `
      var res = new Response();
      alert(res.statusText);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'OK'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('response ok is true', () => {
    const code = `
      var res = new Response();
      alert(res.ok);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: true
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('creates Headers object from raw headers', () => {
    const code = `
      var r = new Response('{"foo":"bar"}', {headers: {'content-type': 'application/json'}});
      alert(r.headers instanceof Headers);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: true
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('deletes headers', () => {
    const code = `
      var headers = new Headers();
      headers.set('Content-Type', 'application/json');
      var trueValue = headers.has('Content-Type');
      headers.delete('Content-Type');
      var falseValue = headers.has('Content-Type');
      var nullValue = headers.get('Content-Type');

      alert([trueValue, falseValue, nullValue]);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: [true, false, null]
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('constructor copies headers', () => {
    const code = `
      var original = new Headers();
      original.append('Accept', 'application/json');
      original.append('Accept', 'text/plain');
      original.append('Content-Type', 'text/html');

      var headers = new Headers(original);
      alert([headers.get('Accept'), headers.get('Content-type')]);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: ['application/json,text/plain', 'text/html']
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });


  it('request construct with url', () => {
    const code = `
      var request = new Request('https://fetch.spec.whatwg.org/');
      alert(request.url);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: 'https://fetch.spec.whatwg.org/'
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('construct with Request and override headers', () => {
    const code = `
      var request1 = new Request('https://fetch.spec.whatwg.org/', {
        method: 'post',
        body: 'I work out',
        headers: {
          accept: 'application/json',
          'X-Request-ID': '123'
        }
      });
      var request2 = new Request(request1, {
        headers: { 'x-test': '42' }
      });

      var val1 = request2.headers.get('accept');
      var val2 = request2.headers.get('x-request-id');
      var val3 = request2.headers.get('x-test');

      alert([val1, val2, val3]);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: [null, null, '42']
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('setTimeout', () => {
    const code = `
      var id = setTimeout(function(){}, 10);
      clearTimeout(id);
    `;

    const mockFn = jest.fn((arg1, arg2) => {
      expect(arg1).toEqual('1');
      expect(arg2).toEqual(10);
    });
    instance.oncall('timer', 'setTimeout', mockFn);

    const mockFn2 = jest.fn((arg1) => {
      expect(arg1).toEqual('1');
    });
    instance.oncall('timer', 'clearTimeout', mockFn2);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
  });

  it('setInterval', () => {
    const code = `
      var id = setInterval(function(){}, 10);
      clearInterval(id);
    `;

    const mockFn1 = jest.fn((arg1, arg2) => {
      expect(arg1).toEqual('1');
      expect(arg2).toEqual(10);
    });
    instance.oncall('timer', 'setInterval', mockFn1);

    const mockFn2 = jest.fn((arg1) => {
      expect(arg1).toEqual('1');
    });
    instance.oncall('timer', 'clearInterval', mockFn2);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
  });

  it('requestAnimationFrame', () => {
    const code = `
      var id = requestAnimationFrame(function(){});
      cancelAnimationFrame(id);
    `;

    const mockFn1 = jest.fn((arg1, arg2) => {
      expect(arg1).toEqual('1');
      expect(arg2).toEqual(16);
    });
    instance.oncall('timer', 'setTimeout', mockFn1);

    const mockFn2 = jest.fn((arg1) => {
      expect(arg1).toEqual('1');
    });
    instance.oncall('timer', 'clearTimeout', mockFn2);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
  });

  it('downgrade', () => {
    const code = `
      __weex_downgrade__({
        ios: {
          osVersion: '>1.0.0',
          appVersion: '>1.0.0',
          weexVersion: '>1.0.0',
          deviceModel: ['modelA', 'modelB']
        },
        android: {
          osVersion: '>1.0.0',
          appVersion: '>1.0.0',
          weexVersion: '>1.0.0',
          deviceModel: ['modelA', 'modelB']
        }
      });
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual(1);
    });

    instance.oncall('instanceWrap', 'error', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });

  it('weex supports', () => {
    const code = `
      var moduleExisted = __weex_module_supports__('webSocket.send');
      var moduleNotexisted = __weex_module_supports__('webSocket.send2');

      var tagExisted = __weex_tag_supports__('div');
      var tagNotexisted = __weex_tag_supports__('divx');
      alert([moduleExisted, moduleNotexisted, tagExisted, tagNotexisted]);
    `;

    const mockFn = jest.fn((args) => {
      expect(args).toEqual({
        message: [true, false, true, false]
      });
    });

    instance.oncall('modal', 'alert', mockFn);

    instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

    expect(mockFn).toHaveBeenCalled();
  });
});
