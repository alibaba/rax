import {Runtime, Instance} from 'weex-vdom-tester';
import {config} from 'weex-js-runtime';
import * as framework from '../index';

const {Document, Element, Comment} = config;
global.callNative = () => {};
global.WXEnvironment = {
  'scale': 2,
  'appVersion': '1.8.3',
  'deviceModel': 'x86_64',
  'appName': 'WeexDemo',
  'platform': 'iOS',
  'osVersion': '9.3',
  'weexVersion': '0.7.0',
  'deviceHeight': 1334,
  'logLevel': 'log',
  'deviceWidth': 750
};

describe('framework', () => {
  let instance;
  let config = {
    bundleUrl: 'http://example.com',
    debug: true
  };
  let data;
  let sendTasksHandler = () => {};
  let sendTasks = function() {
    sendTasksHandler.apply(null, arguments);
  };

  beforeEach(() => {
    // Create a Weex JavaScript runtime for a certain Weex JS framework.
    // You can also simulate the native environment which includes
    // global env variables, native modules & components.
    Document.handler = sendTasks;
    framework.init({ Document, Element, Comment, sendTasks });
    const runtime = new Runtime(framework);
    sendTasksHandler = function() {
      runtime.target.callNative(...arguments);
    };
    // Create a Weex instance in a certain runtime.
    instance = new Instance(runtime);
  });

  afterEach(() => {
    delete Document.handler;
    instance.$destroy();
    instance = null;
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

    instance.$create(code, config, data);

    expect(instance.getRealRoot()).toEqual({
      type: 'div',
      children: [{ type: 'text', attr: { value: 'Hello' }}]
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

    instance.$create(code, config, data);

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

    instance.$create(code, config, data);

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

    instance.$create(code, config, data);

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

    instance.$create(code, config, data);

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

    instance.$create(code, config, data);

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
        message: JSON.stringify({foo: 'foo'})
      });
    });

    instance.oncall('modal', 'alert', mockFn);
    instance.$create(code, config, data);
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
    instance.$create(code, config, data);
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
    instance.$create(code, config, data);
    expect(mockFn).toHaveBeenCalled();
  });

  it('fetch data', () => {
    const code = `
      fetch('http://path/to/api').then(function(response) {
        if (response.status != -1 && response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      }).then(function (data) {
        console.log('fetch response data', data);
      });
    `;

    instance.oncall('stream', 'fetch', (args) => {
      expect(args).toEqual(
        {
          url: 'http://path/to/api',
          method: 'GET',
          type: 'json'
        }
      );
    });

    instance.$create(code, config, data);
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

    instance.$create(code, config, data);

    expect(mockFn).toHaveBeenCalled();
  });
});
