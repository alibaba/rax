const { createTransformNode } = require('../../transformCreator/events');

const LISTENER_ACTION = 'bind';

module.exports = {
  transformNode: createTransformNode(LISTENER_ACTION)
};
