const { transformSync } = require('@babel/core');
const mkdirp = require('mkdirp');
const { dirname, join } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const babelOptions = require('./babelOptions');

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

const getBabelOptions = exports.getBabelOptions = function() {
  return babelOptions;
};

const createRequire = exports.createRequire = function(mod) {
  return 'require(' + mod + ')';
};

const createRequireDefault = exports.createRequireDefault = function(mod) {
  return createRequire(mod) + '.default';
};

/**
 * compile JS TO ES5
 * @param str
 * @param opts
 * @returns {{code, map, ast}}
 */
exports.compileToES5 = function compileToES5(str, opts) {
  const { code, map, ast } = transformSync(str, Object.assign(getBabelOptions(), opts));
  return { code, map, ast };
};

/**
 * query string formatter
 * @type {QueryString}
 */
exports.QueryString = class QueryString {
  constructor(query = {}) {
    this.qsObj = query;
  }

  toString() {
    const result = [];
    Object.keys(this.qsObj).forEach((key) => {
      result.push(`${key}=${encodeURIComponent(this.qsObj[key]) || ''}`);
    });
    return result.join('&');
  }
};

/**
 * get page list
 * @param resourcePath
 * @returns {*|Array}
 */
exports.getPages = function getPages(resourcePath) {
  const appJSONPath = join(resourcePath, '../app.json');
  const appJSON = JSON.parse(readFileSync(appJSONPath, 'utf-8'));
  return appJSON.pages || [];
};

// provide scope vars
// provide render helper vars
const vdomHelperFns = exports.vdomHelperFns = '_c,_s,_l,_t,_m,_v,_e,_cx,_w';
const staticPreveredIdentifiers = 'data,true,false,null,$event,__components_refs__';
const prerveredVars = exports.prerveredVars = makeMap(vdomHelperFns + ',' + staticPreveredIdentifiers);
exports.vdomHelperVars = vdomHelperFns
  .split(',')
  .map(alias => `var ${alias} = __vdom_helpers__.${alias};`)
  .join('');
