const { createTransformNode } = require('../../transformCreator/bind');

const IS_DETECTIVE = /^wx\:/;

module.exports = {
  transformNode: createTransformNode(IS_DETECTIVE)
};
