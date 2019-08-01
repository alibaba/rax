// const clone = require('lodash.clonedeep');
const clone = require('lodash.clone');

const setSSRBase = require('./setSSRBase');
const setSSRBuild = require('./setSSRBuild');

const setWebBase = require('./setWebBase');

const runSSRDev = require('./runSSRDev');

module.exports = ({ chainWebpack, registerConfig, rootDir, onHook, log }) => {
  chainWebpack((config, { command }) => {
    const webConfig = config.get('web');
    // const ssrConfig = clone(config.get('web'));
    const ssrConfig = webConfig;

    // registerConfig('ssr', ssrConfig);

    setSSRBase(ssrConfig, rootDir);
    // setWebBase(webConfig, rootDir);

    if (command === 'build') {
      setSSRBuild(ssrConfig);
    }

    onHook('after.dev', () => {
      runSSRDev(ssrConfig, rootDir, log);
    });
  });
};
