const DOT_RE = /\/\.\//g;
const DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
const MULTI_SLASH_RE = /([^:/])\/+\//g;

function dirname(path) {
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }
  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) return '//';
  return path.slice(0, end);
}

function resolve(from, to) {
  if (to.indexOf('/') == 0) return to;
  if (!from) return to;

  let path = dirname(from) + '/' + to;
  // https://github.com/seajs/seajs/blob/master/src/util-path.js
  // /a/b/./c/./d ==> /a/b/c/d
  path = path.replace(DOT_RE, '/');
  /*
    @author wh1100717
    a//b/c ==> a/b/c
    a///b/////c ==> a/b/c
    DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
  */
  path = path.replace(MULTI_SLASH_RE, '$1/');

  // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, '/');
  }

  return path;
}

exports.resolve = resolve;
