const babelMerge = require('babel-merge');

const babelConfig = require('../../babel.config')();

module.exports = function(ignoreModule) {
  const envOpt = {
    loose: true,
  };

  if (ignoreModule) {
    envOpt.modules = false;
  }

  return babelMerge(babelConfig, {
    presets: [
      ['@babel/preset-env', envOpt],
    ],
  });
};
