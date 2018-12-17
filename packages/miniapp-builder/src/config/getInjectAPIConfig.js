const { join, resolve} = require('path');
const babelConfig = require('./babelConfig');

const assetsLoader = require.resolve('../loaders/InjectAPILoader');

/**
 * CUSTOM API webpack config
 */
module.exports = (projectDir, opts) => {
  return {
    entry: {
      api: assetsLoader + '!' + resolve(projectDir, 'public/index.js')
    },
    output: {
      path: join(projectDir, 'build/pages'),
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
