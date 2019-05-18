const chokidar = require('chokidar');
const { statSync, readdirSync} = require('fs');
const {mkdirpSync, removeSync} = require('fs-extra');
const App = require('./App');

module.exports = class Watcher {
  /**
   * @param options {Object}
   */
  constructor(options) {
    const { sourcePath, distPath } = options;
    const files = this._getAllFilePath(sourcePath, distPath);
    this.watchedFiles = files;
    this.watcher = chokidar.watch(files);
    this.watcher.on('change', (file) => {
      console.log('File changed:', file);
      this._handleFileChanged(file, sourcePath, distPath);
    });
  }

  /**
   * refresh all transformed files
   * @param sourcePath {String} Absolute source path.
   * @param distPath {String} Absolute dist path.
   * @param file {String} Absolute changed file path.
   */
  _handleFileChanged(file, sourcePath, distPath) {
    removeSync(distPath);
    mkdirpSync(distPath);

    new App(sourcePath, {
      appDirectory: sourcePath,
      distDirectory: distPath,
    });
  }

  /**
   * all watching files
   * @param sourcePath {String} Absolute source path.
   * @param distPath {String} Absolute dist path.
   * @return files {Array}
   */
  _getAllFilePath(sourcePath, distPath) {
    let files = [];
    let sourcePathFiles = readdirSync(sourcePath);
    for (let i = 0, l = sourcePathFiles.length; i < l; i++) {
      const item = sourcePathFiles[i];
      const fileItemPath = sourcePath + '/' + item;
      if (item === 'node_modules' || fileItemPath === distPath || item.length > 1 && item.substring(0, 1) === '.') {
        continue;
      }
      if (statSync(fileItemPath).isDirectory()) {
        const childrenFiles = this._getAllFilePath(fileItemPath, distPath);
        files = files.concat(childrenFiles);
      } else {
        files.push(fileItemPath);
      }
    }
    return files;
  }
};
