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
 * Add ./ at the start of filepath
 * @param {string} filepath
 * @returns {string}
 */
function addRelativePathPrefix(filepath) {
  return filepath[0] !== '.' ? `./${filepath}` : filepath;
}

/**
 * Use '/' as path sep regardless of OS when outputting the path to code
 * @param {string} filepath
 */
function normalizeOutputFilePath(filepath) {
  return filepath.replace(/\\/g, '/');
}

/**
 * use '/'(Linux/Unix) or '\'(Windows) as path sep in local file system
 * @param {string} filepath
 */
function normalizeLocalFilePath(filepath) {
  return filepath.replace(/\\|\//g, sep);
}

module.exports = {
  getNpmName,
  normalizeFileName,
  addRelativePathPrefix,
  normalizeOutputFilePath,
  normalizeLocalFilePath
};
