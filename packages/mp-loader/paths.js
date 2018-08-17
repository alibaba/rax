/**
 * paths definition
 */
module.exports = {
  getApp: require.resolve('mp-runtime/src/getApp.js'),
  App: require.resolve('mp-runtime/src/app.js'),
  Page: require.resolve('mp-runtime/src/page.js'),
  sfcRuntime: require.resolve('sfc-runtime'),
  injectThisScope: require.resolve('sfc-compiler/codegen/injectThisScope'),
};
