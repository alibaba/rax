const gutil = require('gutil');
const { join } = require('path');
const { existsSync } = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');
const getPluginWebpackConfig = require('../../config/getPluginWebpackConfig');
const copy = require('../copy');

const PLUGIN_CONFIG = 'plugin.json';
const DEMO_PROJECT = 'miniprogram';

module.exports = function(projectDir, destDir) {
  return done => {
    const pluginConfigFile = join(projectDir, PLUGIN_CONFIG);
    if (!existsSync(pluginConfigFile)) {
      throw new Error(PLUGIN_CONFIG + ' file not exists.');
    }

    const pluginName = require(pluginConfigFile).name;
    copy(pluginConfigFile, join(destDir, PLUGIN_CONFIG));
    webpack(merge(getPluginWebpackConfig(projectDir, { pluginName }), {
      output: {
        path: destDir,
      },
    }), function(err, stats) {
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
