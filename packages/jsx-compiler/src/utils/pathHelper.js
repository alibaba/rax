function getNpmName(value) {
  const isScopedNpm = /^_?@/.test(value);
  return value.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
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
