const { join, resolve} = require('path');
const babelConfig = require('./babelConfig');
const { getAppConfig } = require('./getAppConfig');

const apiLoader = require.resolve('../loaders/ExternalAPILoader');

/**
 * CUSTOM API webpack config
 */
module.exports = (projectDir) => {
  const appConfig = getAppConfig(projectDir);

  return {
    entry: {
      api: apiLoader + '!' + resolve(projectDir, appConfig.externalApi)
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
