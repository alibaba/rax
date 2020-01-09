const { sep } = require('path');

function getNpmName(value) {
  const isScopedNpm = /^_?@/.test(value);
  return value.split(sep).slice(0, isScopedNpm ? 2 : 1).join(sep);
}

/**
 * For that alipay build folder can not contain `@`, escape to `_`.
 */
function normalizeFileName(filename) {
  return filename.replace(/@/g, '_');
}

module.exports = {
  getNpmName,
  normalizeFileName
};
