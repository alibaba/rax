const cloneDeep = require('lodash/cloneDeep');
const SSRDevServer = require('rax-ssr-dev-server');

const getSSRBase = require('./ssr/getBase');
const setSSRBuild = require('./ssr/setBuild');
const setSSRDev = require('./ssr/setDev');
const runSSRDev = require('./ssr/runDev');

const setWebBase = require('./setWebBase');

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
      setDevServer(SSRDevServer);
      setSSRDev(config.get('ssr'), rootDir);
    }
  });
};
