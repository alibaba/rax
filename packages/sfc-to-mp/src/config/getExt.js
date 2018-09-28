const { getOption } = require('./cliOptions');

const EXTS = {
  ali: {
    template: '.axml',
    style: '.acss',
    script: '.js',
  },
  wx: {
    template: '.wxml',
    style: '.wxss',
    script: '.js',
  },
};

module.exports = function getExt(type) {
  const targetType = getOption('target');
  return EXTS[targetType][type];
};
