exports.baseOptions = {
  cwd: process.cwd(),
  modules: require('./modules'),
  targetAdapter: require('./targetAdapter'),
  /**
   * Whether add whitespace between tags.
   */
  preserveWhitespace: false,
};
