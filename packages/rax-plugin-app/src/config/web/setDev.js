'use strict';

module.exports = (config, context) => {
  config.devServer.historyApiFallback({
    index: 'build/web/index.html'
  });
};
