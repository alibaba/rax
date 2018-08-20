exports.colors = require('colors');

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
exports.cached = cached;

/**
 * Mix properties into target object.
 */
function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}
exports.extend = extend;

/**
 * always return false
 */
exports.no = function() {
  return false;
};

exports.log = function log(...args) {
  return console.log.call(console, exports.colors.green('[WVT]'), ...args);
};

exports.warn = function warn(...args) {
  return console.log.call(
    console,
    exports.colors.yellow('[WVT WARN]'),
    ...args
  );
};

exports.error = function error(...args) {
  return console.log.call(console, exports.colors.red('[WVT ERR]'), ...args);
};

const mkdirp = require('mkdirp');
const { dirname } = require('path');
const { writeFileSync } = require('fs');

exports.safeWriteFile = function safeWriteFile(path, content) {
  mkdirp.sync(dirname(path));
  writeFileSync(path, content, 'utf-8');
};

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
exports.makeMap = function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? val => map[val.toLowerCase()] : val => map[val];
};

const { transformSync } = require('@babel/core');

const cwd = process.cwd();
function getBabelOptions() {
  return {
    presets: [
      require('@babel/preset-env'),
    ],
    plugins: [
      [require('babel-plugin-root-imports'), {
        rootPathPrefix: '/',
        rootPathSuffix: cwd
      }],

      // Stage 0
      require('@babel/plugin-proposal-function-bind'),

      // Stage 1
      require('@babel/plugin-proposal-export-default-from'),
      require('@babel/plugin-proposal-logical-assignment-operators'),
      [require('@babel/plugin-proposal-optional-chaining'), { 'loose': false }],
      [require('@babel/plugin-proposal-pipeline-operator'), { 'proposal': 'minimal' }],
      [require('@babel/plugin-proposal-nullish-coalescing-operator'), { 'loose': false }],
      require('@babel/plugin-proposal-do-expressions'),

      // Stage 2
      [require('@babel/plugin-proposal-decorators'), { 'legacy': true }],
      require('@babel/plugin-proposal-function-sent'),
      require('@babel/plugin-proposal-export-namespace-from'),
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-proposal-throw-expressions'),

      // Stage 3
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { 'loose': false }],
      require('@babel/plugin-proposal-json-strings')
    ]
  };
};

exports.compileES5 = function compileES5(str, opts) {
  const { code, map, ast } = transformSync(str, Object.assign(getBabelOptions(), opts));
  return { code, map, ast };
};

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
