let FRAMEWORK_VERSION = exports.FRAMEWORK_VERSION = require('./frameworkVersion');

const FRAMEWORK_CDN_PREFIX = 'https://g.alicdn.com/code/npm/miniapp-framework/';
const FRAMEWORK_CDN_SUFFIX = '/dist';

const FRAMEWORK_RENDERER_VIEW = '/native/renderer.html';

exports.updateFrameworkVersion = function(version) {
  FRAMEWORK_VERSION = exports.FRAMEWORK_VERSION = version;
};

const getNativeRendererUrl = exports.getNativeRendererUrl = function(version) {
  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_RENDERER_VIEW;
};
exports.nativeRendererUrl = getNativeRendererUrl(FRAMEWORK_VERSION);