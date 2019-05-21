const { createTransformNode } = require('../../transformCreator/list');

const ATTRIBUTES = {
  FOR: 'wx:for',
  FOR_ITEM: 'wx:for-item',
  FOR_IDX: 'wx:for-index'
};

module.exports = {
  transformNode: createTransformNode(ATTRIBUTES)
};
