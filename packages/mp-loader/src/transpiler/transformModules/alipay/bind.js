const { createTransformNode } = require('../../transformCreator/bind');

const IS_DETECTIVE = /^a\:/;

module.exports = {
  transformNode: createTransformNode(IS_DETECTIVE)
};
