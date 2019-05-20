const { transformNodeWrapper} = require('../../../transpiler/transpileModules/bind');

const IS_DETECTIVE = /^a\:/;

module.exports = {
  transformNode: transformNodeWrapper(IS_DETECTIVE)
};
