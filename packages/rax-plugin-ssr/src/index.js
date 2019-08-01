const SSRDevServer = require('rax-ssr-dev-server');

const getSSRBase = require('./ssr/getBase');
const setSSRBuild = require('./ssr/setBuild');
const setSSRDev = require('./ssr/setDev');

const setWebBase = require('./setWebBase');
const setDevServerConfig = require('./ssr/setDevServerConfig');

// can‘t clone webpack chain object
module.exports = ({ chainWebpack, registerConfig, setDevServer, rootDir, onHook, log }) => {
  chainWebpack((config, { command }) => {
    const webConfig = config.get('web');
    registerConfig('ssr', getSSRBase(rootDir));

    setWebBase(webConfig, rootDir);

    if (command === 'build') {
      setSSRBuild(config.get('ssr'), rootDir);
    }

    if (command === 'dev') {
      setDevServerConfig(webConfig, rootDir);
      setDevServer(SSRDevServer);
      setSSRDev(config.get('ssr'), rootDir);
    }
  });
};
