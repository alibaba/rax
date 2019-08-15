const setEntry = require('./setEntry');

module.exports = ({ context, chainWebpack }) => {
  chainWebpack((config) => {
    setEntry(config.getConfig('web'), context, 'web');
    setEntry(config.getConfig('weex'), context, 'weex');
  });
};
