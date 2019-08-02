const SSRDevServer = require('rax-ssr-dev-server');

const getSSRBuildConfig = require('./ssr/getBuildConfig');
const getSSRDevConfig = require('./ssr/getDevConfig');
const setWebBaseConfig = require('./web/setBaseConfig');

// can‘t clone webpack chain object
module.exports = ({ chainWebpack, registerConfig, setDevServer, rootDir, onHook, log }) => {
  chainWebpack((config, { command }) => {
    const webConfig = config.get('web');
    setWebBaseConfig(webConfig, rootDir);

    let ssrConfig;
    if (command === 'build') {
      ssrConfig = getSSRBuildConfig(rootDir);
    }

    if (command === 'dev') {
      ssrConfig = getSSRDevConfig(rootDir);
      setDevServer(SSRDevServer);
    }

    registerConfig('ssr', ssrConfig);
  });
};
