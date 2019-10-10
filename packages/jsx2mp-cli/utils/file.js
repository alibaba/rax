const {
  readFileSync,
  lstatSync,
  ensureFileSync,
  writeFileSync
} = require('fs-extra');
const { relative } = require('path');
const chalk = require('chalk');

/**
 * Get file content as utf-8 text.
 * @param path {String} Absolute path to a text file.
 */
const getFileContent = function(path) {
  return readFileSync(path, 'utf-8');
};

/**
 * Judge a path is a directory.
 * @param path {String} Absolute path to a file or directory.
 * @return {Boolean}
 */
const isDirectory = function(path) {
  return lstatSync(path).isDirectory();
};

/**
 * Write file and ensure folder exists.
 * @param path {String} File path.
 * @param content {String} File content.
 * @param rootPath {String} project path.
 * @private
 */
const writeFile = function(path, content, rootPath) {
  ensureFileSync(path);
  console.log(chalk.green('Write'), relative(rootPath, path));
  writeFileSync(path, content, 'utf-8');
};

/**
 * Get directory path under root
 * @param {string} dirname e.g. src/constant/test
 * @param {string} root e.g. src
 * @returns {string} e.g. constant/test
 */
const getCurrentDirectoryPath = function(dirname, root = 'src') {
  const rootPosition = dirname.indexOf(root);
  if (rootPosition === -1) {
    throw new Error(`Current directory ${dirname} is not under ${root}`);
  }
  return dirname.slice(rootPosition + root.length);
};

module.exports = {
  isDirectory,
  getFileContent,
  writeFile,
  getCurrentDirectoryPath
};
