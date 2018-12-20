const { join, resolve} = require('path');
const babelConfig = require('./babelConfig');

const apiLoader = require.resolve('../loaders/InjectAPILoader');

/**
 * CUSTOM API webpack config
 */
module.exports = (projectDir, opts) => {
  return {
    entry: {
      api: apiLoader + '!' + resolve(projectDir, 'api.js')
    },
    output: {
      path: join(projectDir, 'build'),
      filename: '[name].js',
    },
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: require.resolve('babel-loader'),
          options: babelConfig,
        },
      ],
    }
  };
};
