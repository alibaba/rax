const FRAMEWORK_VERSION = exports.FRAMEWORK_VERSION = '0.1.24';
const FRAMEWORK_CDN_PREFIX = 'https://g.alicdn.com/code/npm/miniapp-framework/';
const FRAMEWORK_CDN_SUFFIX = '/dist';

const FRAMEWORK_WORKER = '/native/worker.js';
const FRAMEWORK_RENDERER = '/native/renderer.js';
const FRAMEWORK_RENDERER_VIEW = '/native/renderer.html';

const FRAMEWORK_H5_MASTER = '/h5/master.js';
const FRAMEWORK_H5_VIEW = '/h5/master.html';

const getNativeRendererHTML = exports.getNativeRendererHTML = function(version) {
  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_RENDERER_VIEW;
};
exports.nativeRendererHTML = getNativeRendererHTML(FRAMEWORK_VERSION);

const getH5Master = exports.getH5Master = function(version) {
  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_H5_MASTER;
};
exports.h5Master = getH5Master(FRAMEWORK_VERSION);

const getH5MasterView = exports.getH5MasterView = function(version) {
  return FRAMEWORK_CDN_PREFIX + version + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_H5_VIEW;
};
exports.h5MasterView = getH5MasterView(FRAMEWORK_VERSION);
