exports.baseOptions = {
  cwd: process.cwd(),
  modules: require('./modules'),
  adapter: require('./adapter'),
  /**
   * Whether add whitespace between tags.
   */
  preserveWhitespace: false,
};
