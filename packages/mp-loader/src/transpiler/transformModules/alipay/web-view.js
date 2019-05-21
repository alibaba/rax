const { createTransformNode } = require('../../transformCreator/web-view');

const MESSAGE_ATTRIBUTE = 'onMessage';

module.exports = {
  transformNode: createTransformNode(MESSAGE_ATTRIBUTE)
};
