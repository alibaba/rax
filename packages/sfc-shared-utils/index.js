const htmlparser = require('htmlparser2');
const uuidv4 = require('uuid/v4');
const uppercamelcase = require('uppercamelcase');

// uppercamelcase
exports.uppercamelcase = uppercamelcase;

// each compiler share a same uiid
exports.uniqueInstanceID = 'i' + uuidv4().slice(0, 5);

exports.getDomObject = function getDomObject(html) {
  const handler = new htmlparser.DomHandler();
  const parser = new htmlparser.Parser(handler, {
    xmlMode: true
  });

  parser.parseComplete(html);

  return handler.dom;
};

exports.innerHTML = function innerHTML(dom) {
  return htmlparser.DomUtils.getOuterHTML(dom, {
    xmlMode: true
  });
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

/**
 * Mix properties into target object.
 */
const extend = exports.extend = function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
};

/**
 * Always return false.
 */
exports.no = function no() {
  return false;
};

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
 * Merge an Array of Objects into a single Object.
 */
exports.toObject = function toObject(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

/**
 * Generate a static keys string from compiler modules.
 */
exports.genStaticKeys = function genStaticKeys(modules) {
  return modules
    .reduce((keys, m) => {
      return keys.concat(m.staticKeys || []);
    }, [])
    .join(',');
};

const colors = require('colors');

exports.warn = function warn(msg) {
  return console.warn(colors.yellow('[WARN]'), msg);
};

exports.objectValues = function objectValues(arr) {
  return typeof Object.values === 'function' ? Object.values(arr) : Object.keys(arr).map((k) => arr[k]);
};
