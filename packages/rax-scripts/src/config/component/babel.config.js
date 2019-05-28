const babelConfig = require('../babel.config');

babelConfig.presets.push([
  require.resolve('@babel/preset-react'),
  {
    pragma: 'createElement',
    pragmaFrag: 'Fragment'
  }
]);
babelConfig.ignore = ['**/**/*.d.ts'];
module.exports = babelConfig;
