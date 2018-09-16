const FRAMEWORK_VERSION = '0.1.1';
const FRAMEWORK_CDN_PREFIX = 'https://g.alicdn.com/code/npm/miniapp-framework/';
const FRAMEWORK_CDN_SUFFIX = '/dist';

const FRAMEWORK_WORKER = '/native/worker.js';
const FRAMEWORK_RENDERER = '/native/renderer.js';
const FRAMEWORK_RENDERER_VIEW = '/native/renderer.html';

const FRAMEWORK_H5_MASTER = '/h5/master.js';
const FRAMEWORK_H5_VIEW = '/h5/master.html';

exports.nativeRendererHTML = FRAMEWORK_CDN_PREFIX + FRAMEWORK_VERSION + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_RENDERER_VIEW;
exports.h5Master = FRAMEWORK_CDN_PREFIX + FRAMEWORK_VERSION + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_H5_MASTER;
exports.h5MasterView = FRAMEWORK_CDN_PREFIX + FRAMEWORK_VERSION + FRAMEWORK_CDN_SUFFIX + FRAMEWORK_H5_VIEW;
