const gutil = require('gutil');
const webpack = require('webpack');
const merge = require('webpack-merge');
const getWebpackConfig = require('../../config/getWebpackConfig');

module.exports = function(projectDir, destDir) {
  return done => {
    const baseConfig = getWebpackConfig(projectDir);
    const config = merge(baseConfig, {
      mode: 'production',
      devtool: false,
      output: { path: destDir }
    });

    webpack(config, function(err, stats) {
      if (err) {
        gutil.log('[Build Err]', err);
        process.exit(1);
      } else if (stats.toJson().errors.length > 0) {
        gutil.log('[Build Err]', stats.toString({ all: true }));
        process.exit(1);
      } else {
        gutil.log(
          '[Build Success]',
          stats.toString({
            colors: true,
            children: false,
            modules: false,
            chunks: false,
            entrypoints: false,
            assets: false
          })
        );
        done();
      }
    });
  };
};
