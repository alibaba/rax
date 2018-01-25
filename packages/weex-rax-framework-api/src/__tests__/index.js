// 'use strict';

import * as framework from '../index';

let instanceContext = {
  bundleUrl: 'http://example.com',
  document: {
    taskCenter: {
      callbackManager: {
        lastCallbackId: 0,
      }
    }
  },
  __weex_options__: {
    debug: true,
    weex: {
      config: {},
      requireModule: () => {
        // mock
        return {
          error: () => {}, // nativeInstanceWrap
          alert: () => {}, // modal
          addEventListener: () => {}, // globalEvent
          WebSocket: () => {}, // websocket
          onmessage: () => {}, // websocket
          onopen: () => {}, // websocket
          onclose: () => {}, // websocket
          onerror: () => {}, // websocket
          setTimeout: (handler, time) => {
            handler();
          }, // timer
          clearTimeout: (n) => {}, // timer
          setInterval: (handler, time) => {
            handler();
          }, // timer
          clearInterval: (n) => {}, // timer
          push: () => {}, // weexNavigator
          close: () => {}, // weexNavigator
        };
      },
      isRegisteredModule: () => {
        return true;
      },
      isRegisteredComponent: () => {
        return true;
      },
    },
  }
};
global.BroadcastChannel = {
  onmessage: (listener) => {
    listener();
  }
};
global.callNative = () => {};
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

let window = framework.resetInstanceContext(instanceContext);

describe('frameworkapi', () => {
//   let instance;
//   let runtime;
//   let __weex_options__ = {
//     bundleUrl: 'http://example.com',
//     debug: true
//   };
//   let __weex_callbacks__;
//   let __weex_data__;
//   let sendTasksHandler = () => { };
//   let sendTasks = function() {
//     return sendTasksHandler.apply(null, arguments);
//   };

//   beforeEach(() => {
//     // Create a Weex JavaScript runtime for a certain Weex JS framework.
//     // You can also simulate the native environment which includes
//     // global env variables, native modules & components.
//     Document.handler = sendTasks;
//     framework.init({ Document, Element, Comment });
//     runtime = new Runtime(framework);
//     framework.registerModules({
//       webSocket: ['addEventListener', 'removeAllEventListeners', 'onopen', 'onerror', 'send', 'onmessage', 'close', 'onclose', 'WebSocket'],
//       geolocation: ['addEventListener', 'removeAllEventListeners', 'getCurrentPosition', 'watchPosition', 'clearWatch'],
//       audio: ['addEventListener', 'removeAllEventListeners', 'canPlayType', 'stop', 'pause', 'load', 'play', 'setVolume'],
//       picker: ['addEventListener', 'removeAllEventListeners', 'pickTime', 'pickDate', 'pick'],
//       globalEvent: ['addEventListener', 'removeEventListener'],
//     });

//     framework.registerComponents(['div', 'video']);
//     sendTasksHandler = function() {
//       runtime.target.callNative(...arguments);
//       // FIXME: Hack for should return value like setTimeout
//       return '1';
//     };
//     // Create a Weex instance in a certain runtime.
//     instance = new Instance(runtime);
//   });

//   afterEach(() => {
//     delete Document.handler;
//     instance.$destroy();
//     instance = null;
//   });

  /*
    api test
  */

  it('window.Promise', () => {
    let myFirstPromise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve('hi');
      }, 250);
    });
    myFirstPromise.then(function(successMessage) {
      expect(successMessage).toEqual('hi');
    });
  });

  it('window.Symbol', () => {
    expect(typeof Symbol()).toEqual('symbol');
  });

  it('window.Map', () => {
    var myMap = new Map();
    myMap.set(NaN, 'not a number');
    expect(myMap.get(NaN)).toEqual('not a number');
  });

  it('window.Set', () => {
    let mySet = new Set();
    mySet.add(1);
    expect(mySet.has(1)).toEqual(true);
  });

  it('window.WeakMap', () => {
    var wm = new WeakMap();
    var o = {};
    wm.set(o, 37);
    expect(wm.get(o)).toEqual(37);
  });

  it('window.WeakSet', () => {
    var ws = new WeakSet();
    var obj = {};
    ws.add(obj);
    expect(ws.has(obj)).toEqual(true);
  });

  it('window.name', () => {
    expect(window.name).toEqual('');
  });

  it('window.closed', () => {
    expect(window.closed).toEqual(false);
  });

  it('window.atob', () => {
    expect(window.atob('aGk=')).toEqual('hi');
  });

  it('window.btoa', () => {
    expect(window.btoa('hi')).toEqual('aGk=');
  });

  it('window.performance', () => {
    expect(window.performance.timing.unloadEventStart).toEqual(0);
    expect(window.performance.timing.loadEventStart).toEqual(0);
  });

  it('window.location', () => {
    expect(window.location.href).toEqual('http://example.com/');
  });

  it('window.navigator', () => {
    expect(window.navigator.product).toEqual('Weex');
    expect(window.navigator.platform).toEqual('iOS');
    expect(window.navigator.appName).toEqual('WeexDemo');
    expect(window.navigator.appVersion).toEqual('1.8.3');
    expect(window.navigator.userAgent).toEqual('Weex/0.7.0 iOS/9.3 (iPhone7,2) WeexDemo/1.8.3');
  });

  it('window.screen', () => {
    expect(window.screen.width).toEqual(750);
    expect(window.screen.height).toEqual(1334);
    expect(window.screen.availWidth).toEqual(750);
    expect(window.screen.availHeight).toEqual(1334);
    expect(window.screen.colorDepth).toEqual(24);
    expect(window.screen.pixelDepth).toEqual(24);
  });

  it('window.location', () => {
    expect(window.devicePixelRatio).toEqual(2);
  });

  it('window.fetch', () => {
    window.fetch('http://example.com').then(function(response) {
      if (response.status != -1 && response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(function(data) {
      expect(data).toEqual(null);
      console.log('fetch response data', data);
    });
  });

  it('window.Headers', () => {
    var r = new window.Response('{"foo":"bar"}', {headers: {'content-type': 'application/json'}});
    expect(r.headers instanceof window.Headers).toEqual(true);
  });

  it('window.Response', () => {
    var res = new window.Response();
    expect(res.status).toEqual(200);
  });

  it('window.Request request construct with url', () => {
    var request = new window.Request('https://fetch.spec.whatwg.org/');
    expect(request.url).toEqual('https://fetch.spec.whatwg.org/');
  });

  it('window.Request construct with Request and override headers', () => {
    var request1 = new window.Request('https://fetch.spec.whatwg.org/', {
      method: 'post',
      body: 'I work out',
      headers: {
        accept: 'application/json',
        'X-Request-ID': '123'
      }
    });
    var request2 = new window.Request(request1, {
      headers: { 'x-test': '42' }
    });

    var val1 = request2.headers.get('accept');
    var val2 = request2.headers.get('x-request-id');
    var val3 = request2.headers.get('x-test');

    expect([val1, val2, val3]).toEqual([null, null, '42']);
  });

  // it('window.XMLHttpRequest', () => {

  //   var xhr = new XMLHttpRequest();
  //   xhr.open('GET', 'http://example.com');
  //   xhr.send();

  //   expect(xhr).toEqual(
  //     {
  //       url: 'http://example.com',
  //       method: 'GET',
  //       type: 'text',
  //       headers: {}
  //     }
  //   );
  // });


  it('window.URL', () => {
    var a = new window.URL('/', 'https://developer.mozilla.org'); // Creates a URL pointing to 'https://developer.mozilla.org/'
    var b = new window.URL('https://developer.mozilla.org');      // Creates a URL pointing to 'https://developer.mozilla.org/'
    var c = new window.URL('en-US/docs', b);                      // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var d = new window.URL('/en-US/docs', b);                     // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var f = new window.URL('/en-US/docs', d);                     // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var g = new window.URL('/en-US/docs', 'https://developer.mozilla.org/fr-FR/toto');
                                                           // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var h = new window.URL('/en-US/docs', a);                     // Creates a URL pointing to 'https://developer.mozilla.org/en-US/docs'
    var i = new window.URL('/en-US/docs', '');                    // Raises a SYNTAX ERROR exception as '/en-US/docs' is not valid
    var j = new window.URL('/en-US/docs');                        // Raises a SYNTAX ERROR exception as 'about:blank/en-US/docs' is not valid
    var k = new window.URL('http://www.example.com', 'https://developers.mozilla.com');
                                                           // Creates a URL pointing to 'http://www.example.com/'
    var l = new window.URL('http://www.example.com', b);          // Creates a URL pointing to 'http://www.example.com/'

    alert(l.toString());
    expect(l.toString()).toEqual('http://www.example.com/');
  });

  it('window.URL.searchParams', () => {
    var params = (new window.URL('https://developer.mozilla.org?hello=world')).searchParams;
    expect(params.get('hello')).toEqual('world');
  });

  it('window.URLSearchParams', () => {
    var paramsString = 'q=URLUtils.searchParams&topic=api';
    var searchParams = new window.URLSearchParams(paramsString);
    searchParams.has('topic') === true; // true
    searchParams.get('topic') === 'api'; // true
    searchParams.getAll('topic'); // ["api"]
    searchParams.get('foo') === null; // true
    searchParams.append('topic', 'webdev');
    searchParams.toString(); // "q=URLUtils.searchParams&topic=api&topic=webdev"
    searchParams.set('topic', 'More webdev');
    searchParams.toString(); // "q=URLUtils.searchParams&topic=More+webdev"
    searchParams.delete('topic');
    searchParams.toString(); // "q=URLUtils.searchParams"

    expect(searchParams.toString()).toEqual('q=URLUtils.searchParams');
  });

  it('window.FontFace', () => {
    var bitterFontFace = new window.FontFace('Bitter', 'url(https://fonts.gstatic.com/s/bitter/v7/HEpP8tJXlWaYHimsnXgfCOvvDin1pK8aKteLpeZ5c0A.woff2)');
    expect(bitterFontFace.family).toEqual('Bitter');
  });

  it('window.WebSocket', () => {
    const ws = new window.WebSocket('ws://echo.websocket.org');
    expect(ws.readyState).toEqual(0);
  });


  it('window.CustomEvent', () => {
    var ev = new window.CustomEvent('click', {
      detail: 'custom'
    });
    expect(ev.type).toEqual('click');
  });


  it('window.matchMedia', () => {
    var mql = window.matchMedia('(min-width: 400px)').matches;
    expect(mql).toEqual(false);
  });


  it('window.setTimeout', () => {
    const callback = jest.fn();
    var id = window.setTimeout(callback, 10);
    window.clearTimeout(id);
    expect(callback).toHaveBeenCalled();
  });

  it('window.setInterval', () => {
    const callback = jest.fn();
    var id = window.setInterval(callback, 10);
    window.clearInterval(id);
    expect(callback).toHaveBeenCalled();
  });

  it('window.requestAnimationFrame', () => {
    const callback = jest.fn();
    var id = window.requestAnimationFrame(callback);
    window.cancelAnimationFrame(id);
    expect(callback).toHaveBeenCalled();
  });

  // it('window.setImmediate', () => {
  //   const callback = jest.fn();
  //   var id = window.setImmediate(() => {
  //     callback();
  //   });
  //   window.clearImmediate(id);
  //   expect(callback).toHaveBeenCalled();
  // });

  it('window.frameworkVersion', () => {
    var frameworkVersion = window.frameworkVersion;
    expect(frameworkVersion).toEqual(null);
  });

  it('window.alert', () => {
    expect(typeof window.alert).toEqual('function');
  });

  it('window.open', () => {
    expect(typeof window.open).toEqual('function');
  });

  it('window.close', () => {
    expect(typeof window.close).toEqual('function');
  });

  // it('window.postMessage window.addEventListener', () => {
  //   const callback = jest.fn();
  //   window.addEventListener('message', callback);
  //   window.postMessage({foo: 'foo'}, '*');
  //   expect(callback).toHaveBeenCalled();
  // });


  it('window.onerror', () => {
    const callback = jest.fn();
    window.onerror = callback;
    window.onerror();
    expect(callback).toHaveBeenCalled();
  });

  it('window.define', () => {
    const callback = jest.fn();
    window.define('hello', callback, callback);
    const hello = window.require('hello');
    expect(callback).toHaveBeenCalled();
    expect(hello).toEqual({});
  });

  it('window.callNative', () => {
    expect(typeof window.callNative).toEqual('function');
  });


  /*
    more test
  */

  // it('weex only var', () => {
  //   const code = `
  //     alert(__weex_options__.debug)
  //   `;

  //   const mockFn = jest.fn((args) => {
  //     expect(args).toEqual({
  //       message: __weex_options__.debug
  //     });
  //   });

  //   instance.oncall('modal', 'alert', mockFn);
  //   instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

  //   expect(mockFn).toHaveBeenCalled();
  // });


  it('window is window.window', () => {
    expect(window.window).toEqual(window);
  });

  it('self is window', () => {
    expect(window.self).toEqual(window);
  });

  // it('this is window', () => {
  //   expect(window.this).toEqual(window);
  // });

  // it('window is global context', () => {
  //   this.foo = 'foo';
  //   expect(foo).toEqual('foo');
  // });

  // it('run in strict mode', () => {
  //   expect((a = 'throws ReferenceError')).toThrowError(/a is not defined/);
  // });

//   it('run in Object.prototype freeze mode', () => {
//     const code = `
//       function Foo(){}
//       // Throw Error
//       Foo.prototype.toString = function(){};
//       // Could use Foo.prototype = {toString(){}}
//     `;

//     expect(function() {
//       instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
//     }).toThrowError(/Cannot assign to read only property/);
//   });

//   it('run in Object freeze mode', () => {
//     const code = `
//       // Throw Error
//       Object.assgin = function(){}
//     `;

//     expect(function() {
//       instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
//     }).toThrowError(/object is not extensible/);
//   });

//   it('run in Object freeze mode', () => {
//     const code = `
//       var foo = new Object();
//       // Throw Error
//       foo.toString = function(){};
//     `;

//     expect(function() {
//       instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);
//     }).toThrowError(/Cannot assign to read only property/);
//   });


//   it('document', () => {
//     const code = `
//       alert(document.URL);
//     `;

//     const mockFn = jest.fn((args) => {
//       expect(args).toEqual({
//         message: 'http://example.com'
//       });
//     });

//     instance.oncall('modal', 'alert', mockFn);

//     instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

//     expect(mockFn).toHaveBeenCalled();
//   });

//   it('navigator', () => {
//     const code = `
//       alert(navigator.platform);
//     `;

//     const mockFn = jest.fn((args) => {
//       expect(args).toEqual({
//         message: 'iOS'
//       });
//     });

//     instance.oncall('modal', 'alert', mockFn);

//     instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

//     expect(mockFn).toHaveBeenCalled();
//   });


//   it('response default statusText is OK', () => {
//     const code = `
//       var res = new Response();
//       alert(res.statusText);
//     `;

//     const mockFn = jest.fn((args) => {
//       expect(args).toEqual({
//         message: 'OK'
//       });
//     });

//     instance.oncall('modal', 'alert', mockFn);

//     instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

//     expect(mockFn).toHaveBeenCalled();
//   });

//   it('response ok is true', () => {
//     const code = `
//       var res = new Response();
//       alert(res.ok);
//     `;

//     const mockFn = jest.fn((args) => {
//       expect(args).toEqual({
//         message: true
//       });
//     });

//     instance.oncall('modal', 'alert', mockFn);

//     instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

//     expect(mockFn).toHaveBeenCalled();
//   });

  it('deletes headers', () => {
    var headers = new window.Headers();
    headers.set('Content-Type', 'application/json');
    var trueValue = headers.has('Content-Type');
    headers.delete('Content-Type');
    var falseValue = headers.has('Content-Type');
    var nullValue = headers.get('Content-Type');

    expect([trueValue, falseValue, nullValue]).toEqual([true, false, null]);
  });

//   it('constructor copies headers', () => {
//     const code = `
//       var original = new Headers();
//       original.append('Accept', 'application/json');
//       original.append('Accept', 'text/plain');
//       original.append('Content-Type', 'text/html');

//       var headers = new Headers(original);
//       alert([headers.get('Accept'), headers.get('Content-type')]);
//     `;

//     const mockFn = jest.fn((args) => {
//       expect(args).toEqual({
//         message: ['application/json,text/plain', 'text/html']
//       });
//     });

//     instance.oncall('modal', 'alert', mockFn);

//     instance.$create(code, __weex_callbacks__, __weex_options__, __weex_data__);

//     expect(mockFn).toHaveBeenCalled();
//   });


  it('downgrade', () => {
    let a = window.__weex_downgrade__({
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

    expect(a).toEqual(true);
  });

  it('weex supports', () => {
    var moduleExisted = window.__weex_module_supports__('webSocket.send');
    var tagExisted = window.__weex_tag_supports__('div');
    expect([moduleExisted, tagExisted]).toEqual([true, true]);
  });
});
