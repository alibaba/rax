const mkdirp = require('mkdirp');
const { dirname, join } = require('path');
const { writeFileSync } = require('fs');

const LOG_PREFIX = 'MINIAPP';

/**
 * colors
 */
exports.colors = require('colors');

/**
 * Create a cached version of a pure function.
 */
exports.cached = function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
/**
 * Mix properties into target object.
 */
exports.extend = function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
};

/**
 * always return false
 */
exports.no = function() {
  return false;
};

exports.log = function log(...args) {
  return console.log.call(console, exports.colors.green(`[${LOG_PREFIX}]`), ...args);
};

exports.warn = function warn(...args) {
  return console.log.call(
    console,
    exports.colors.yellow(`[${LOG_PREFIX} WARN]`),
    ...args
  );
};

exports.error = function error(...args) {
  return console.log.call(console, exports.colors.red(`[${LOG_PREFIX} ERROR]`), ...args);
};

exports.safeWriteFile = function safeWriteFile(path, content) {
  mkdirp.sync(dirname(path));
  writeFileSync(path, content, 'utf-8');
};

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
const makeMap = exports.makeMap = function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
};

const createRequire = exports.createRequire = function(modulePath) {
  return `(function() { var obj = require(${modulePath}); return obj && obj.__esModule ? obj.default : obj; })()`;
};

// provide scope vars
// provide render helper vars
const renderHelperFns = exports.renderHelperFns = '_c,_s,_l,_t,_m,_v,_e,_cx,_u';
const staticPreveredIdentifiers = 'data,true,false,null,$event,__components_refs__';
const prerveredVars = exports.prerveredVars = makeMap(renderHelperFns + ',' + staticPreveredIdentifiers + ',' + '_w');
exports.renderHelperVars = renderHelperFns
  .split(',')
  .map(alias => `var ${alias} = __render_helpers__.${alias};`)
  .join('');
