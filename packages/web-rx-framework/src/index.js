const global = window;

// ES
if (!global.Promise) {
  global.Promise = require('runtime-shared/dist/promise.module');
}

// W3C
require('whatwg-fetch');
require('raf/polyfill');

if (!global.URL) {
  global.URL = require('runtime-shared/dist/url.module');
}

if (!global.URLSearchParams) {
  global.URLSearchParams = require('runtime-shared/dist/url-search-params.module');
}

// ModuleJS
require('./require');

// Default Builtin modules
global.define('@universal/rx', function(req, exports, module) {
  module.exports = require('universal-rx');
});

global.define('@universal/env', function(req, exports, module) {
  module.exports = require('universal-env');
});

global.define('@universal/transition', function(req, exports, module) {
  module.exports = require('universal-transition');
});
