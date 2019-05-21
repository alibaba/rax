const { createTransformNode } = require('../../transformCreator/web-view');

const MESSAGE_ATTRIBUTE = 'bindmessage';

module.exports = {
  transformNode: createTransformNode(MESSAGE_ATTRIBUTE)
};
