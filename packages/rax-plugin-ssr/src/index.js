const getSSRBase = require('./ssr/getBase');
const setSSRBuild = require('./ssr/setBuild');
const setSSRDev = require('./ssr/setDev');

const setWebDev = require('./web/setDev');

// can‘t clone webpack chain object
module.exports = ({ chainWebpack, registerConfig, setDevServer, context }) => {
  process.env.RAX_SSR = 'true';
  const { command } = context;
  const ssrConfig = getSSRBase(context);
  registerConfig('ssr', ssrConfig);

  chainWebpack((config) => {
    if (command === 'build') {
      setSSRBuild(config.getConfig('ssr'), context);
    }

    if (command === 'dev') {
      setSSRDev(config.getConfig('ssr'), context);
      setWebDev(config.getConfig('web'), context);
    }
  });
};
