const { transformNodeWrapper} = require('../../../transpiler/transpileModules/bind');

const IS_DETECTIVE = /^wx\:/;

module.exports = {
  transformNode: transformNodeWrapper(IS_DETECTIVE)
};
