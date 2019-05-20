const { transformNodeWrapper} = require('../../../transpiler/transpileModules/condition');

const ATTRIBUTES = {
  IF: 'wx:if',
  ELSE_IF: 'wx:elif',
  ELSE: 'wx:else'
};

module.exports = {
  transformNode: transformNodeWrapper(ATTRIBUTES)
};
