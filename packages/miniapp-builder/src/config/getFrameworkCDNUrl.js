const address = require('address');
let FRAMEWORK_VERSION = exports.FRAMEWORK_VERSION = require('./frameworkVersion');

const FRAMEWORK_CDN_PREFIX = 'https://g.alicdn.com/code/npm/miniapp-framework/';
const FRAMEWORK_CDN_SUFFIX = '/dist';

const FRAMEWORK_WORKER = '/native/worker.js';
const FRAMEWORK_RENDERER = '/native/renderer.js';
const FRAMEWORK_RENDERER_VIEW = '/native/renderer.html';

const MASTER = {
  'web': '/web/master.js',
  'ide': '/h5/master.js'
};

const VIEW = {
  'web': '/web/master.html',
  'ide': '/h5/master.html'
};

const localIP = address.ip();
const LOCAL_PREFIX = `http://${localIP}:8003`;

exports.updateFrameworkVersion = function(version) {
  FRAMEWORK_VERSION = exports.FRAMEWORK_VERSION = version;
};

const getNativeRendererUrl = exports.getNativeRendererUrl = function(version) {
  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_RENDERER_VIEW;
};
exports.nativeRendererUrl = getNativeRendererUrl(FRAMEWORK_VERSION);

exports.getMaster = function(version, type) {
  if (process.env.DEBUG === 'true') {
    return LOCAL_PREFIX + MASTER[type];
  }

  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + MASTER[type];
};

exports.getMasterView = function(version, type) {
  if (process.env.DEBUG === 'true') {
    return LOCAL_PREFIX + VIEW[type];
  }

  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + VIEW[type];
};