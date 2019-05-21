const { createTransformNode } = require('../../transformCreator/events');

const LISTENER_ACTION = 'on';

module.exports = {
  transformNode: createTransformNode(LISTENER_ACTION)
};
