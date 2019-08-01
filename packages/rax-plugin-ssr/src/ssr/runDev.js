const path = require('path');
const chalk = require('chalk');
const address = require('address');
const deepmerge = require('deepmerge');
const webpack = require('webpack');
const SSRDevServer = require('rax-ssr-dev-server');


const getEntries = require('../getEntries');

module.exports = (config, rootDir, log) => {
  debugger;
  const entries = getEntries(rootDir);
  const pagesManifest = {};
  Object.keys(entries).forEach(entry => {
    pagesManifest[entry] = path.resolve(rootDir, `build/server/${entry}.js`);
  });

  const webpackConfig = config.toConfig();

  const absoluteAppJSONPath = path.join(rootDir, 'src/app.json');
  const appJSON = require(absoluteAppJSONPath);

  const distDir = config.output.get('path');
  const filename = config.output.get('filename');

  const routes = {};
  appJSON.routes.forEach((route) => {
    const pathName = route.name || route.component.replace(/\//g, '_');
    routes[route.path] = path.join(distDir, filename.replace('[name]', pathName));
  });

  let devServerConfig = {
    port: 10100,
    host: address.ip(),
    routes
  };

  if (webpackConfig.devServer) {
    devServerConfig = deepmerge(devServerConfig, webpackConfig.devServer);
  }

  let compiler;
  try {
    compiler = webpack(webpackConfig);
  } catch (err) {
    log.error(chalk.red('Failed to load webpack config.'));
    log.error(err.message || err);
    process.exit(1);
  }

  const devServer = new SSRDevServer(compiler, devServerConfig);

  devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
    if (err) {
      console.log(chalk.red('[ERR]: Failed to start webpack dev server'));
      console.error(err.message || err);
      process.exit(1);
    }

    const serverUrl = `http://${devServerConfig.host}:${devServerConfig.port}`;

    console.log(chalk.green('[Web] Starting the development server at:'));
    console.log('   ', chalk.underline.white(serverUrl));

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  });
};
