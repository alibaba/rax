const { createTransformNode } = require('../../../transpiler/transformCreator/list');

const ATTRIBUTES = {
  FOR: 'a:for',
  FOR_ITEM: 'a:for-item',
  FOR_IDX: 'a:for-index'
};

module.exports = {
  transformNode: createTransformNode(ATTRIBUTES)
};
