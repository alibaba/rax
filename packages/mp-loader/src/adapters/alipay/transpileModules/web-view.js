const { createTransformNode } = require('../../../transpiler/transformCreator/web-view');

const MESSAGE_ATTRIBUTE = 'onMessage';

module.exports = {
  transformNode: createTransformNode(MESSAGE_ATTRIBUTE)
};
