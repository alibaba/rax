const { extname, sep } = require('path');

function removeExt(path, platform) {
  const ext = extname(path);
  const extReg = new RegExp(`${platform ? `(.${platform})?` : ''}${ext}$`.replace(/\\./g, '\\.'));
  return path.replace(extReg, '');
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

/**
 * add double backslashs in case that filePath contains single backslashs
 * @param {string} filePath
 * @returns {string}
 */
function doubleBackslash(filePath) {
  return filePath.replace(/\\/g, '\\\\');
}

/**
 * Replace backslashs with slashs
 * for pages and usingComponents in json don't support backslashs
 *
 * @param {*} filePath
 */
function replaceBackSlashWithSlash(filePath) {
  return filePath.replace(/\\/g, '/');
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
  removeExt,
  isFromTargetDirs,
  replaceExtension,
  doubleBackslash,
  replaceBackSlashWithSlash,
  addRelativePathPrefix
};
