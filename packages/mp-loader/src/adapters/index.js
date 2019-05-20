const { createParse } = require('./parser');
const { createGenerate } = require('./generate');

module.exports = function createAdapter(mpType) {
  if (mpType === 'wx') {
    // return weapp extension & parse & generate
    const modules = require('./weapp/transpileModules');
    return {
      extension: {
        CSS_EXT: '.wxss',
        TEMPLATE_EXT: '.wxml',
        CONFIG_EXT: 'json'
      },
      parse: createParse(modules),
      generate: createGenerate(modules)
    };
  } else {
    // return alipay mp extension & parse & generate
    const modules = require('./alipay/transpileModules');
    return {
      extension: {
        CSS_EXT: '.acss',
        TEMPLATE_EXT: '.axml',
        CONFIG_EXT: 'json'
      },
      parse: createParse(modules),
      generate: createGenerate(modules)
    };
  }
};
