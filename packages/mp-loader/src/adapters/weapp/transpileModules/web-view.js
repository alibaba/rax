const { createTransformNode } = require('../../../transpiler/transformCreator/web-view');

const MESSAGE_ATTRIBUTE = 'bindmessage';

module.exports = {
  transformNode: createTransformNode(MESSAGE_ATTRIBUTE)
};
