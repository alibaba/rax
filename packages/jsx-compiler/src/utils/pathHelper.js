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

/**
 * Add ./ (Linux/Unix) or .\ (Windows) at the start of filepath
 * @param {string} filepath
 * @returns {string}
 */
function addRelativePathPrefix(filepath) {
  return filepath[0] !== '.' ? `.${sep}${filepath}` : filepath;
}
module.exports = {
  getNpmName,
  normalizeFileName,
  addRelativePathPrefix
};
