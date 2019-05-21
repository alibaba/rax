const { createTransformNode } = require('../../../transpiler/transformCreator/condition');

const ATTRIBUTES = {
  IF: 'a:if',
  ELSE_IF: 'a:elif',
  ELSE: 'a:else'
};

module.exports = {
  transformNode: createTransformNode(ATTRIBUTES)
};
