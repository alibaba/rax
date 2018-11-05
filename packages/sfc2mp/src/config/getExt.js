const { getOption } = require('./cliOptions');

const PLATFORM_FILE_SUFFIX_MAP = {
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
  const ext = PLATFORM_FILE_SUFFIX_MAP[targetType][type];
  if (!ext) {
    throw new Error(`Unkown type '${type}' on platform ${targetType}`);
  }
  return ext;
};
