const { transformNodeWrapper} = require('../../../transpiler/transpileModules/key');

const ATTR_KEY = 'wx:key';

module.exports = {
  transformNode: transformNodeWrapper(ATTR_KEY)
};
