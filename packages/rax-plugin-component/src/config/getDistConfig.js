const path = require('path');
const nodeExternals = require('webpack-node-externals');

const getBaseWebpack = require('./getBaseWebpack');
const setUserConfig = require('./user/setConfig');

module.exports = (context) => {
  const config = getBaseWebpack(context);

  const { rootDir } = context;

  config.target('web');

  config.entry('index')
    .add(path.resolve(rootDir, 'src/index'));

  config.externals(nodeExternals());

  setUserConfig(config, context, 'weex');

  return config;
};
