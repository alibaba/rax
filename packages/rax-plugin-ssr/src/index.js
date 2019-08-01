const cloneDeep = require('lodash/cloneDeep');

const getSSRBase = require('./ssr/getBase');
const setSSRBuild = require('./ssr/setBuild');
const setSSRDev = require('./ssr/setDev');
const runSSRDev = require('./ssr/runDev');

const setWebBase = require('./setWebBase');

// can‘t clone webpack chain object
module.exports = ({ chainWebpack, registerConfig, rootDir, onHook, log }) => {
  chainWebpack((config, { command }) => {
    const webConfig = config.get('web');

    setWebBase(webConfig, rootDir);

    if (command === 'build') {
      registerConfig('ssr', getSSRBase(rootDir));
      setSSRBuild(config.get('ssr'), rootDir);
    }

    onHook('after.dev', () => {
      const devConfig = getSSRBase(rootDir);
      setSSRDev(devConfig, rootDir);
      runSSRDev(devConfig, rootDir, log);
    });
  });
};
