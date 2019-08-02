const SSRDevServer = require('rax-ssr-dev-server');

const getSSRBuildConfig = require('./ssr/getBuildConfig');
const getSSRDevConfig = require('./ssr/getDevConfig');


// can‘t clone webpack chain object
module.exports = ({ chainWebpack, registerConfig, setDevServer, rootDir, onHook, log }) => {
  chainWebpack((config, { command }) => {
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
