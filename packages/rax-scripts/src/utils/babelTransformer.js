const babelConfig = require('../config/babel.config');

babelConfig.presets.push([
  require.resolve('@babel/preset-react'),
  {
    pragma: 'createElement',
    pragmaFrag: 'Fragment'
  }
]);
babelConfig.presets.push(require.resolve('@babel/preset-typescript'));
module.exports = require('babel-jest').createTransformer(babelConfig);
