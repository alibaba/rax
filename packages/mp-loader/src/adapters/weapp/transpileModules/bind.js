const { createTransformNode } = require('../../../transpiler/transformCreator/bind');

const IS_DETECTIVE = /^wx\:/;

module.exports = {
  transformNode: createTransformNode(IS_DETECTIVE)
};
