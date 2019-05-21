const { createTransformNode } = require('../../../transpiler/transformCreator/key');

const ATTR_KEY = 'a:key';

module.exports = {
  transformNode: createTransformNode(ATTR_KEY)
};
