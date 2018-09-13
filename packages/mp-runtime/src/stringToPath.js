const reLeadingDot = /^\./;
// a..b
// a[][]b
const rePropName = /[^.[\]]+|\[(?:(-?\d+)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */
const reEscapeChar = /\\(\\)?/g;
const stringToPathCache = {};

export default function stringToPath(stringPath) {
  if (stringToPathCache[stringPath]) {
    return stringToPathCache[stringPath];
  }
  const result = [];
  if (reLeadingDot.test(stringPath)) {
    result.push('');
  }
  stringPath.replace(rePropName, (match, num, quote, str) => {
    let part = match;
    if (quote) {
      part = str.replace(reEscapeChar, '$1');
    } else if (num) {
      part = parseInt(num, 10);
    }
    result.push(part);
  });
  stringToPathCache[stringPath] = result;
  return result;
}
