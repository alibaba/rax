const global = window;

// ES
if (!global.Promise) {
  global.Promise = require('runtime-shared/dist/promise.module');
}
require('./object');
require('./array');

// W3C
require('whatwg-fetch');
require('raf/polyfill');

if (!global.FontFace) {
  global.FontFace = require('runtime-shared/dist/fontface.module');
}

if (!global.matchMedia) {
  global.matchMedia = require('runtime-shared/dist/matchMedia.module');
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
  global.URL = require('runtime-shared/dist/url.module');
}

if (!global.URLSearchParams) {
  global.URLSearchParams = require('runtime-shared/dist/url-search-params.module');
}

// ModuleJS
require('./require');

// Polyfills for weex
require('./appear');

// Default Builtin modules
global.define('rax', function(req, exports, module) {
  module.exports = require('rax');
});
