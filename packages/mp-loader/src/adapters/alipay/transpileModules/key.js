const { transformNodeWrapper} = require('../../../transpiler/transpileModules/key');

const ATTR_KEY = 'a:key';

module.exports = {
  transformNode: transformNodeWrapper(ATTR_KEY)
};
