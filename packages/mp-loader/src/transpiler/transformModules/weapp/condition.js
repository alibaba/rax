const { createTransformNode } = require('../../transformCreator/condition');

const ATTRIBUTES = {
  IF: 'wx:if',
  ELSE_IF: 'wx:elif',
  ELSE: 'wx:else'
};

module.exports = {
  transformNode: createTransformNode(ATTRIBUTES)
};
