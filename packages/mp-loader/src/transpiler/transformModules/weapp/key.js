const { createTransformNode } = require('../../transformCreator/key');

const ATTR_KEY = 'wx:key';

module.exports = {
  transformNode: createTransformNode(ATTR_KEY)
};
