/**
 * Declear transformer option
 */
class Option {
  /**
   * @param appDirectory {String} Project directory.
   * @param distDirectory {String} Dist path.
   * @param watch {Boolean} Watch mode, default to false.
   */
  constructor({
    appDirectory,
    distDirectory,
    watch = false,
  }) {
    this.appDirectory = appDirectory;
    this.distDirectory = distDirectory;
    this.watch = watch;
  }
}

module.exports = Option;
