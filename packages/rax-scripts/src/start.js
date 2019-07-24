'use strict';
/* eslint no-console: 0 */
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('chalk');
const jsx2mp = require('jsx2mp');
const WebpackDevServer = require('webpack-dev-server');
const SSRDevServer = require('rax-ssr-dev-server');
const path = require('path');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const webpackDevServerConfig = require('./config/webpackDevServer.config');
const getDevServerConfig = require('./config/webapp/getDevServerConfig');
const envConfig = require('./config/env.config');
const pathConfig = require('./config/path.config');
const appConfig = require('./config/app.config');
const { getWebpackConfig } = require('./config/');

const MINIAPP = 'miniapp';
const COMPONENT_MINIAPP = 'component-miniapp';

/**
 * run webpack dev server
 */
module.exports = function start(type = 'webapp') {
  if (type === MINIAPP) {
    jsx2mp(pathConfig.appDirectory, pathConfig.appDist, {
      enableWatch: true,
      type: 'project',
      dist: 'dist',
      entry: pathConfig.universalAppEntry,
    });
  } else if (type === COMPONENT_MINIAPP) {
    process.argv.push('--gulpfile', path.resolve(__dirname, './config/component/gulpfile-miniapp.js'));
    process.argv.push('--cwd', process.cwd());
    require('gulp-cli')();
  } else {
    const webpackConfig = getWebpackConfig(type, 'dev');
    const compiler = createWebpackCompiler(webpackConfig);

    const devServerConfig = webpackDevServerConfig;

    if (appConfig.ssr) {
      const ssrDevServerConfig = getDevServerConfig();
      Object.assign(devServerConfig, ssrDevServerConfig);
    }

    // rewire webpack dev config
    if (Array.isArray(webpackConfig)) {
      const customConfig = webpackConfig.find(config => {
        return config.devServer;
      });
      customConfig && Object.assign(devServerConfig, customConfig.devServer);
    } else if (webpackConfig.devServer) {
      Object.assign(devServerConfig, webpackConfig.devServer);
    }

    let devServer;
    if (appConfig.ssr) {
      devServer = new SSRDevServer(compiler, devServerConfig);
    } else {
      devServer = new WebpackDevServer(compiler, devServerConfig);
    }

    // Launch WebpackDevServer.
    devServer.listen(envConfig.port, envConfig.hostname, (err) => {
      if (err) {
        console.log(colors.red('[ERR]: Failed to webpack dev server'));
        console.error(err.message || err);
        process.exit(1);
      }

      const serverUrl = `${envConfig.protocol}//${envConfig.host}:${envConfig.port}`;

      function tipWeex(bundlePath) {
        console.log(colors.green('[Weex] Scan the weex bundle url:'));
        console.log(`    ${colors.underline.white(serverUrl + bundlePath + '?wh_weex=true')}`);
      }

      function tipWeb() {
        console.log(colors.green('[Web] Starting the development server at:'));
        console.log(`    ${colors.underline.white(serverUrl)}`);
      }

      console.log('');
      if (type === 'weexapp') {
        tipWeex('/index.js');
      } else if (type === 'webapp') {
        tipWeb();
      } else if (type === 'universalapp') {
        tipWeb();
        console.log('');
        tipWeex('/index.weex.js');
      }
      console.log('');

      ['SIGINT', 'SIGTERM'].forEach(function(sig) {
        process.on(sig, function() {
          devServer.close();
          process.exit();
        });
      });
    });
  }
};
