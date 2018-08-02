const webpack = require('webpack');
const getWebpackConfig = require('../config');

/**
 * 
 * @param {*} rootDir 
 */
module.exports = function startDevServer(rootDir) {
  const watchOpts = {
    aggregateTimeout: 300,
  };

  return getWebpackConfig(rootDir)
    .then(config => {
      const compiler = webpack(config);
      return compiler.watch(watchOpts, (err, stats) => {
        if (err) {
          console.log(err);
        }
        console.log(stats.toString({
          colors: true
        }));
      });
    });
}