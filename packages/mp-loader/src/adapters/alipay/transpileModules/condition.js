const { transformNodeWrapper} = require('../../../transpiler/transpileModules/condition');

const ATTRIBUTES = {
  IF: 'a:if',
  ELSE_IF: 'a:elif',
  ELSE: 'a:else'
};

module.exports = {
  transformNode: transformNodeWrapper(ATTRIBUTES)
};
