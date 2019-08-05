const SSRDevServer = require('rax-ssr-dev-server');

const getSSRBuildConfig = require('./ssr/getBuildConfig');
const getSSRDevConfig = require('./ssr/getDevConfig');
const setWebBaseConfig = require('./web/setBaseConfig');

// can‘t clone webpack chain object
module.exports = ({ chainWebpack, registerConfig, setDevServer, context }) => {
  chainWebpack((config, { command }) => {
    // TODO
    context.userConfig = Object.assign(context.userConfig, {
      outputDir: 'build',
      publicPath: '/',
      devPublicPath: '/',
    });

    const rootDir = context.rootDir;
    setWebBaseConfig(config, rootDir);

    let ssrConfig;
    if (command === 'build') {
      ssrConfig = getSSRBuildConfig(context);
    }

    if (command === 'dev') {
      ssrConfig = getSSRDevConfig(context);
      setDevServer(SSRDevServer);
    }

    registerConfig('ssr', ssrConfig);
  });
};
