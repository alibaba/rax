const global = window;

const shared = require('runtime-shared');
// ES
if (!global.Promise) {
  global.Promise = shared.Promise;
}

if (!global.Symbol) {
  global.Symbol = shared.Symbol;
}

if (!global.Set) {
  global.Set = shared.Set;
}

if (!global.Map) {
  global.Map = shared.Map;
}

require('./object');
require('./array');

// W3C
require('whatwg-fetch');
require('raf/polyfill');

if (!global.FontFace) {
  global.FontFace = shared.FontFace;
}

if (!global.matchMedia) {
  global.matchMedia = shared.matchMedia;
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


if (!global.URL) {
  global.URL = shared.URL;
}

if (!global.URLSearchParams) {
  global.URLSearchParams = shared.URLSearchParams;
}

// ModuleJS
require('./require');

// Polyfills for weex
require('./appear');

// Default Builtin modules
global.define('rax', function(req, exports, module) {
  module.exports = require('rax');
});
