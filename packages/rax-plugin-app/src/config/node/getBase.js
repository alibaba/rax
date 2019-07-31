'use strict';

const getWebpackBase = require('../getWebpackBase');
const { setEntries } = require('./setEntries');

module.exports = () => {
  const config = getWebpackBase();

  setEntries(config);

  config.target('node');

  config.output
    .filename('server/[name].js')
    .libraryTarget('commonjs2');
  
  config.externals({
    rax: 'rax',
  });

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  return config;
};
