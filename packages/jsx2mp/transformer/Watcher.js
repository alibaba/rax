const chokidar = require('chokidar');

module.exports = class Watcher {
  constructor() {
    this.watchedFiles = [];
    this.watcher = chokidar.watch('**/*', {
      ignored: /(^|[\/\\])\../,
    });
    this.watcher.on('change', (file) => {
      console.log('File changed:', file);
      if (this.handleFileChanged) this.handleFileChanged(file);
    });
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
