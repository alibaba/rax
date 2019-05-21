const createParse = require('../transpiler/createParse');
const createGenerate = require('../transpiler/createGenerate');

module.exports = function createAdapter(mpType) {
  if (mpType === 'weixin') {
    // return weapp extension & parse & generate & transform modules
    const modules = require('./weapp/transpileModules');
    return {
      extension: {
        CSS_EXT: '.wxss',
        TEMPLATE_EXT: '.wxml',
        CONFIG_EXT: 'json'
      },
      parse: createParse(modules),
      generate: createGenerate(modules),
      modules
    };
  } else {
    // return alipay mp extension & parse & generate & transform modules
    const modules = require('./alipay/transpileModules');
    return {
      extension: {
        CSS_EXT: '.acss',
        TEMPLATE_EXT: '.axml',
        CONFIG_EXT: 'json'
      },
      parse: createParse(modules),
      generate: createGenerate(modules),
      modules
    };
  }
};
