'use strict';
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const getBaseWebpackConfig = require('./getBaseConfig');

module.exports = (rootDir) => {
  const config = getBaseWebpackConfig(rootDir);

  config.mode('production');

  // config.optimization
  //   .minimize(true)
  //   .minimizer('uglify')
  //     .use(UglifyJSPlugin, [{
  //       include: /\.js$/,
  //       cache: true,
  //       sourceMap: true,
  //     }])
  //     .end();

  return config;
};
