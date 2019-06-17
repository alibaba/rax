const chokidar = require('chokidar');
const { statSync, readdirSync } = require('fs-extra');
const { createApp } = require('./App');

/**
 * all watching files
 * @param sourcePath {String} Absolute source path.
 * @param distPath {String} Absolute dist path.
 * @return files {Array}
 */
const getAllFilePath = function(sourcePath, distPath) {
  let files = [];
  let sourcePathFiles = readdirSync(sourcePath);
  for (let i = 0, l = sourcePathFiles.length; i < l; i++) {
    const item = sourcePathFiles[i];
    const fileItemPath = sourcePath + '/' + item;
    if (item === 'node_modules' || fileItemPath === distPath || item.length > 1 && item.substring(0, 1) === '.') {
      continue;
    }
    if (statSync(fileItemPath).isDirectory()) {
      const childrenFiles = getAllFilePath(fileItemPath, distPath);
      files = files.concat(childrenFiles);
    } else {
      files.push(fileItemPath);
    }
  }
  return files;
};

/**
 * refresh all transformed files
 * @param sourcePath {String} Absolute source path.
 * @param distPath {String} Absolute dist path.
 * @param file {String} Absolute changed file path.
 */
const handleFileChanged = function(file, sourcePath, distPath) {
  createApp(sourcePath, distPath);
};

/**
 * start watching files change
 * @param sourcePath {String} Absolute source path.
 * @param distPath {String} Absolute dist path.
 */
const startWatching = function(sourcePath, distPath) {
  const files = getAllFilePath(sourcePath, distPath);
  const watcher = chokidar.watch(files);
  watcher
    .on('change', (file) => {
      console.log('File changed:', file);
      handleFileChanged(file, sourcePath, distPath);
    })
    .on('error', (error) => {
      console.log('Error happened', error);
    });
};

module.exports = {
  startWatching
};
