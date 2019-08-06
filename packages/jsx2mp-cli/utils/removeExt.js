const { extname } = require('path');

function removeExt(path) {
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

module.exports = removeExt;
