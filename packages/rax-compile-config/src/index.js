const getBabelConfig = require('./getBabelConfig');
const setBabelAlias = require('./setBabelAlias');
const handleWebpackErr = require('./handleWebpackErr');
const getRouteName = require('./getRouteName');

const hmrClient = require.resolve('./hmr/webpackHotDevClient.entry');

module.exports = {
  getRouteName,
  getBabelConfig,
  setBabelAlias,
  hmrClient,
  handleWebpackErr
};
