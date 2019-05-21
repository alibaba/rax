const { createTransformNode } = require('../../../transpiler/transformCreator/bind');

const IS_DETECTIVE = /^a\:/;

module.exports = {
  transformNode: createTransformNode(IS_DETECTIVE)
};
