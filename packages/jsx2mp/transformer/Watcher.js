const chokidar = require('chokidar');
const compiler = require('jsx-compiler');
const { statSync, readdirSync} = require('fs');
const {mkdirpSync, removeSync} = require('fs-extra');
const App = require('./App');

module.exports = class Watcher {
  constructor(options) {
    const { sourcePath, distPath } = options;
    const files = this._getAllFilePath(sourcePath, distPath);
    this.watchedFiles = files;
    this.watcher = chokidar.watch(files);
    this.watcher.on('change', (file) => {
      console.log('File changed:', file);
      if (this.handleFileChanged) this.handleFileChanged(file, sourcePath, distPath);
    });
  }

  handleFileChanged(file, sourcePath, distPath) {
    removeSync(distPath);
    mkdirpSync(distPath);

    new App(sourcePath, {
      appDirectory: sourcePath,
      distDirectory: distPath,
    });
  }

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

  /**
   * Add watch files.
   * @param files
   */
  watch(files) {
    for (let i = 0, l = files.length; i < l; i ++) {
      const file = files[i];
      if (this.watchedFiles.indexOf(file) > -1) continue;
      this.watcher.add(file);
      this.watchedFiles.push(file);
    }
  }

  /**
   * Unwatch all files.
   */
  unwatch() {
    this.watchedFiles = [];
    this.watcher.unwatch('**/*');
    this.watcher = null;
  }
};
