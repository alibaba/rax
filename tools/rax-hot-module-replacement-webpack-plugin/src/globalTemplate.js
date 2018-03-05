const Template = require('./Template');
const XMLHttpRequestRuntime = Template.getFunctionContent(require('./polyfill/XMLHttpRequest'));

module.exports = `
var global;

if (typeof window !== 'undefined') {
  global = window;
} else if (typeof global !== 'undefined') {
  global = global;
} else if (typeof self !== 'undefined') {
  global = self;
} else {
  global = {};
};


// reload polyfill
var isWeex = typeof callNative === 'function';

if (isWeex && typeof location.reload === 'undefined') {
  var LOCATION_MODULE = '@weex-module/location';

  location.reload = function(forceReload) {
    var weexLocation = require(LOCATION_MODULE);
    weexLocation.reload(forceReload);
  };
};

if (typeof XMLHttpRequest === 'undefined') {
  ${XMLHttpRequestRuntime}
}
`;
