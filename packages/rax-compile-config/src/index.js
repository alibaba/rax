const getBabelConfig = require('./getBabelConfig');
const setBabelAlias = require('./setBabelAlias');

const hmrClient = require.resolve('./hmr/webpackHotDevClient.entry');

module.exports = {
  getBabelConfig,
  setBabelAlias,
  hmrClient
};
