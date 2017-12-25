const global = window;

const shared = require('runtime-shared');

// ES
require('./number');
require('./object');
require('./array');

if (!global.Promise) {
  global.Promise = shared.Promise;
}

if (!global.Symbol) {
  global.Symbol = shared.Symbol;
}

if (!global.Map) {
  global.Map = shared.Map;
}

if (!global.Set) {
  global.Set = shared.Set;
}

if (!global.WeakMap) {
  global.WeakMap = shared.WeakMap;
}

if (!global.WeakSet) {
  global.WeakSet = shared.WeakSet;
}

// W3C
require('whatwg-fetch');
require('raf/polyfill');

if (!global.FontFace) {
  global.FontFace = shared.FontFace;
}

if (!global.matchMedia) {
  global.matchMedia = shared.matchMedia;
}

if (!global.URL) {
  global.URL = shared.URL;
}

if (!global.URLSearchParams) {
  global.URLSearchParams = shared.URLSearchParams;
}

if (!document.fonts) {
  document.fonts = {
    add: function(fontFace) {
      let fontFaceRule = `@font-face {
        font-family: ${fontFace.family};
        src: ${fontFace.source}
      }`;

      let styleElement = document.createElement('style');
      styleElement.innerHTML = fontFaceRule;
      document.head.appendChild(styleElement);
    }
  };
}

// ModuleJS
require('./require');

// Polyfills for weex
require('./appear');

// Default Builtin modules
global.define('rax', function(req, exports, module) {
  module.exports = require('rax');
});
