const { extname, sep } = require('path');

function removeExt(path) {
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

/**
 * judge whether the child dir is part of parent dir
 * @param {string} child
 * @param {string} parent
 */
function isChildOf(child, parent) {
  const childArray = child.split(sep).filter(i => i.length);
  const parentArray = parent.split(sep).filter(i => i.length);
  const clen = childArray.length;
  const plen = parentArray.length;

  let j = 0;
  for (let i = 0; i < plen; i++) {
    if (parentArray[i] === childArray[j]) {
      j++;
    }
    if (j === clen) {
      return true;
    }
  }
  return false;
}


/**
 * Check whether testPath is from targetDir
 *
 * @param {string} testPath
 * @param {string} targetDir
 * @returns {boolean}
 */
function isFromTargetDir(testPath, targetDir) {
  return isChildOf(targetDir, testPath);
}


/**
 * Check whether testPath is from one of the targetDirs
 *
 * @param {string} testPath
 * @returns {Function}
 */
function isFromTargetDirs(targetDirs) {
  return (testPath) => {
    return targetDirs.some(targetDir => isFromTargetDir(testPath, targetDir));
  };
}

/**
 * replace the file's extension with new extension
 *
 * @param {string} filePath
 * @param {string} newExtension eg. .ts .js
 * @returns {string}
 */
function replaceExtension(filePath, newExtension) {
  const lastDot = filePath.lastIndexOf('.');
  return filePath.slice(0, lastDot) + newExtension;
}

module.exports = {
  removeExt,
  isFromTargetDirs,
  replaceExtension
};
